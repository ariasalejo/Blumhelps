package co.ariasalejo.blumhelps

import android.content.Context
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import java.time.Instant
import java.time.ZoneOffset
import java.time.DayOfWeek
import java.time.temporal.TemporalAdjusters
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDate
import java.util.UUID
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

internal data class PlannerHabit(val id: String, val title: String, val completedDates: Set<String>)
internal data class PlannerTask(val id: String, val title: String, val dueDate: String, val completed: Boolean)
internal data class PlannerSnapshot(val habits: List<PlannerHabit>, val tasks: List<PlannerTask>)

internal enum class PlannerTaskState { COMPLETED, OVERDUE, DUE_TODAY, UPCOMING }

internal object PlannerRules {
    fun normalizeDate(value: String): String? =
        runCatching { LocalDate.parse(value.trim()).toString() }.getOrNull()

    fun dateToUtcMillis(value: String): Long? = normalizeDate(value)?.let { normalized ->
        runCatching {
            LocalDate.parse(normalized).atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()
        }.getOrNull()
    }

    fun dateFromUtcMillis(value: Long?): String? = value?.let { millis ->
        runCatching { Instant.ofEpochMilli(millis).atZone(ZoneOffset.UTC).toLocalDate().toString() }.getOrNull()
    }

    fun updateCompletionDates(existing: Set<String>, date: String, completed: Boolean): Set<String> {
        val validDate = normalizeDate(date) ?: return existing
        return if (completed) existing + validDate else existing - validDate
    }

    fun status(task: PlannerTask, today: String): PlannerTaskState {
        if (task.completed) return PlannerTaskState.COMPLETED
        val due = normalizeDate(task.dueDate) ?: return PlannerTaskState.UPCOMING
        val current = normalizeDate(today) ?: return PlannerTaskState.UPCOMING
        return when {
            due < current -> PlannerTaskState.OVERDUE
            due == current -> PlannerTaskState.DUE_TODAY
            else -> PlannerTaskState.UPCOMING
        }
    }
    fun earnedMilestones(habits: List<PlannerHabit>, languageCode: String): List<String> {
        val totalCheckIns = habits.sumOf { it.completedDates.size }
        val distinctDays = habits.flatMap { it.completedDates }.toSet().size
        val habitsExplored = habits.count { it.completedDates.isNotEmpty() }
        val spanish = languageCode == "es"
        return buildList {
            if (totalCheckIns >= 1) add(if (spanish) "Primer paso" else "First small step")
            if (totalCheckIns >= 5) add(if (spanish) "Cinco avances" else "Five check-ins")
            if (habitsExplored >= 3) add(if (spanish) "Tres hábitos explorados" else "Three habits explored")
            if (distinctDays >= 7) add(if (spanish) "Una semana de esfuerzo" else "One week of effort")
        }
    }
}


internal data class PlannerOpportunity(
    val title: String,
    val jurisdiction: String,
    val category: String,
    val description: String,
    val url: String,
    val reviewedOn: String = "2026-10-12"
)

private fun plannerOpportunities(): List<PlannerOpportunity> = listOf(
    PlannerOpportunity("GOV.CO · Trámites y servicios", "Colombia · Nacional", "Servicios públicos",
        "Entrada oficial a trámites y servicios. Comprueba siempre las instrucciones, requisitos y fechas con la entidad responsable.",
        "https://www.gov.co/"),
    PlannerOpportunity("SENA Betowa · Formación", "Colombia · Nacional", "Educación y cursos",
        "Consulta cursos e inscripciones vigentes. La oferta, los cupos y las fechas dependen de cada convocatoria.",
        "https://betowa.sena.edu.co/"),
    PlannerOpportunity("Agencia Pública de Empleo SENA", "Colombia · Nacional", "Empleo",
        "Servicio público y gratuito de orientación e intermediación laboral. Las vacantes y requisitos varían.",
        "https://ape.sena.edu.co/personas/Paginas/Servicios.aspx"),
    PlannerOpportunity("Prosperidad Social · Renta Joven", "Colombia · Nacional", "Juventud y transferencias",
        "Revisa requisitos, registros, reportes educativos y cronograma vigente. La app no determina elegibilidad ni garantiza pagos.",
        "https://prosperidadsocial.gov.co/sgpp/transferencias/renta-joven/"),
    PlannerOpportunity("MinSalud · Directorio oficial de IPS", "Colombia · Nacional", "Servicios de salud",
        "Localiza prestadores y confirma directamente habilitación, cobertura, costos, servicios y disponibilidad.",
        "https://prestadores.minsalud.gov.co/directorio/consultaIPS.aspx?pageTitle=Directorio")
)

/** Private, local-only persistence for the first planner phase. */
internal object PlannerStore {
    private const val PREFS_NAME = "blumhelps_planner_v1"
    private const val HABITS_KEY = "habits"
    private const val TASKS_KEY = "tasks"

    fun today(): String = LocalDate.now().toString()

    fun load(context: Context, starterHabits: List<String>): PlannerSnapshot {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val savedHabits = prefs.getString(HABITS_KEY, null)
        val habits = if (savedHabits == null) {
            starterHabits.map { PlannerHabit(UUID.randomUUID().toString(), it, emptySet()) }
                .also { saveHabits(context, it) }
        } else decodeHabits(savedHabits)
        return PlannerSnapshot(habits, decodeTasks(prefs.getString(TASKS_KEY, null)))
    }

    fun addHabit(context: Context, title: String, starterHabits: List<String>) {
        val clean = title.trim().take(80)
        if (clean.isBlank()) return
        saveHabits(context, load(context, starterHabits).habits +
            PlannerHabit(UUID.randomUUID().toString(), clean, emptySet()))
    }

    fun setHabitCompleted(context: Context, id: String, date: String, completed: Boolean, starterHabits: List<String>) {
        if (PlannerRules.normalizeDate(date) == null) return
        val updated = load(context, starterHabits).habits.map { habit ->
            if (habit.id != id) habit else {
                habit.copy(completedDates = PlannerRules.updateCompletionDates(habit.completedDates, date, completed))
            }
        }
        saveHabits(context, updated)
    }

    fun removeHabit(context: Context, id: String, starterHabits: List<String>) {
        saveHabits(context, load(context, starterHabits).habits.filterNot { it.id == id })
    }

    fun addTask(context: Context, title: String, dueDate: String) {
        val clean = title.trim().take(120)
        val validDate = PlannerRules.normalizeDate(dueDate)
        if (clean.isBlank() || validDate == null) return
        saveTasks(context, readTasks(context) + PlannerTask(UUID.randomUUID().toString(), clean, validDate, false))
    }

    fun setTaskCompleted(context: Context, id: String, completed: Boolean) {
        saveTasks(context, readTasks(context).map { if (it.id == id) it.copy(completed = completed) else it })
    }

    fun removeTask(context: Context, id: String) {
        saveTasks(context, readTasks(context).filterNot { it.id == id })
    }

    private fun readTasks(context: Context): List<PlannerTask> =
        decodeTasks(context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).getString(TASKS_KEY, null))

    private fun saveHabits(context: Context, habits: List<PlannerHabit>) {
        val array = JSONArray()
        habits.forEach { habit ->
            val dates = JSONArray()
            habit.completedDates.sorted().forEach { dates.put(it) }
            array.put(JSONObject().put("id", habit.id).put("title", habit.title).put("completedDates", dates))
        }
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit()
            .putString(HABITS_KEY, array.toString()).apply()
    }

    private fun saveTasks(context: Context, tasks: List<PlannerTask>) {
        val array = JSONArray()
        tasks.forEach { task ->
            array.put(JSONObject().put("id", task.id).put("title", task.title)
                .put("dueDate", task.dueDate).put("completed", task.completed))
        }
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE).edit()
            .putString(TASKS_KEY, array.toString()).apply()
    }

    private fun decodeHabits(raw: String): List<PlannerHabit> = runCatching {
        val array = JSONArray(raw)
        buildList {
            for (i in 0 until array.length()) {
                val row = array.optJSONObject(i) ?: continue
                val title = row.optString("title").trim()
                if (title.isNotBlank()) {
                    val dates = mutableSetOf<String>()
                    val storedDates = row.optJSONArray("completedDates")
                    if (storedDates != null) {
                        for (j in 0 until storedDates.length()) {
                            val date = storedDates.optString(j)
                            if (date.isNotBlank()) dates.add(date)
                        }
                    }
                    add(PlannerHabit(row.optString("id").ifBlank { UUID.randomUUID().toString() }, title, dates))
                }
            }
        }
    }.getOrDefault(emptyList())

    private fun decodeTasks(raw: String?): List<PlannerTask> {
        if (raw.isNullOrBlank()) return emptyList()
        return runCatching {
            val array = JSONArray(raw)
            buildList {
                for (i in 0 until array.length()) {
                    val row = array.optJSONObject(i) ?: continue
                    val title = row.optString("title").trim()
                    val date = runCatching { LocalDate.parse(row.optString("dueDate")).toString() }.getOrNull()
                    if (title.isNotBlank() && date != null) {
                        add(PlannerTask(row.optString("id").ifBlank { UUID.randomUUID().toString() },
                            title, date, row.optBoolean("completed", false)))
                    }
                }
            }
        }.getOrDefault(emptyList())
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@androidx.compose.runtime.Composable
internal fun PlannerPanel(
    heading: String,
    intro: String,
    accent: androidx.compose.ui.graphics.Color,
    cardColor: androidx.compose.ui.graphics.Color,
    textColor: androidx.compose.ui.graphics.Color,
    mutedColor: androidx.compose.ui.graphics.Color,
    languageCode: String
) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val starterHabits = rememberStarterHabits()
    var snapshot by androidx.compose.runtime.remember(context) {
        androidx.compose.runtime.mutableStateOf(PlannerStore.load(context, starterHabits))
    }
    var expanded by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(false) }
    var newHabit by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf("") }
    var newTask by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf("") }
    var dueDate by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(PlannerStore.today()) }
    var dateError by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(false) }
    var habitDate by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(PlannerStore.today()) }
    var showHabitDatePicker by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(false) }
    var showTaskDatePicker by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf(false) }
    val today = PlannerStore.today()
    val chosenHabitDate = runCatching { LocalDate.parse(habitDate) }.getOrElse { LocalDate.now() }
    val weekStart = chosenHabitDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
    val weekDates = (0..6).map { weekStart.plusDays(it.toLong()) }
    val dayLabels = if (languageCode == "es") listOf("Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom")
                    else listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
    val completedCount = snapshot.habits.count { habitDate in it.completedDates }
    val encouragement = when {
        completedCount == 0 -> "Cada pequeño paso cuenta."
        snapshot.habits.isNotEmpty() && completedCount == snapshot.habits.size -> "Registraste todos tus hábitos para esta fecha. Celebra el esfuerzo."
        else -> "Avanzar cuenta, aunque sea un solo paso."
    }
    val earnedMilestones = PlannerRules.earnedMilestones(snapshot.habits, languageCode)
    val taskList = snapshot.tasks.sortedWith(compareBy<PlannerTask>({ it.completed }, { it.dueDate }))
    val opportunities = plannerOpportunities()
    val ink = androidx.compose.ui.graphics.Color(0xFF0B1020)

    androidx.compose.material3.Card(
        modifier = androidx.compose.ui.Modifier.fillMaxWidth(),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(24.dp),
        colors = androidx.compose.material3.CardDefaults.cardColors(containerColor = cardColor)
    ) {
        androidx.compose.foundation.layout.Column(
            modifier = androidx.compose.ui.Modifier.padding(17.dp),
            verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(10.dp)
        ) {
            androidx.compose.foundation.layout.Row(
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
                horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(10.dp)
            ) {
                androidx.compose.foundation.layout.Column(modifier = androidx.compose.ui.Modifier.weight(1f)) {
                    androidx.compose.material3.Text(heading, color = textColor, fontSize = 18.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                    androidx.compose.material3.Text(intro, color = mutedColor, fontSize = 12.sp, lineHeight = 18.sp)
                }
                androidx.compose.material3.Button(
                    onClick = { expanded = !expanded },
                    colors = androidx.compose.material3.ButtonDefaults.buttonColors(containerColor = accent, contentColor = ink)
                ) { androidx.compose.material3.Text(if (expanded) "Cerrar" else "Abrir") }
            }
            androidx.compose.material3.Text(
                completedCount.toString() + " / " + snapshot.habits.size + " hábitos en " + habitDate,
                color = accent, fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold, fontSize = 12.sp
            )
            androidx.compose.material3.Text(encouragement, color = mutedColor, fontSize = 11.sp, lineHeight = 16.sp)
            if (earnedMilestones.isNotEmpty()) {
                androidx.compose.material3.Text("Logros personales · " + earnedMilestones.size, color = accent, fontSize = 11.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold)
                androidx.compose.material3.Text(earnedMilestones.joinToString("  •  "), color = mutedColor, fontSize = 11.sp, lineHeight = 16.sp)
                androidx.compose.material3.Text("Insignias simbólicas: no representan dinero ni beneficios institucionales.", color = mutedColor, fontSize = 10.sp, lineHeight = 14.sp)
            }
            if (expanded) {
                androidx.compose.material3.Text("Fecha de seguimiento: " + habitDate, color = mutedColor, fontSize = 12.sp)
                androidx.compose.foundation.layout.Row(
                    modifier = androidx.compose.ui.Modifier.fillMaxWidth(),
                    horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(5.dp),
                    verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                ) {
                    weekDates.forEach { date ->
                        val isSelected = date.toString() == habitDate
                        androidx.compose.material3.Surface(
                            color = if (isSelected) accent else cardColor,
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
                            modifier = androidx.compose.ui.Modifier.weight(1f).clickable { habitDate = date.toString() }
                        ) {
                            androidx.compose.foundation.layout.Column(
                                modifier = androidx.compose.ui.Modifier.padding(vertical = 9.dp, horizontal = 2.dp),
                                horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally,
                                verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(3.dp)
                            ) {
                                androidx.compose.material3.Text(dayLabels[date.dayOfWeek.value - 1], color = if (isSelected) ink else mutedColor, fontSize = 9.sp)
                                androidx.compose.material3.Text(date.dayOfMonth.toString(), color = if (isSelected) ink else textColor, fontSize = 12.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                            }
                        }
                    }
                }
                androidx.compose.material3.OutlinedButton(
                    onClick = { showHabitDatePicker = true },
                    modifier = androidx.compose.ui.Modifier.fillMaxWidth()
                ) { androidx.compose.material3.Text("Elegir otra fecha") }
                androidx.compose.material3.Text("Hábitos", color = textColor, fontSize = 16.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                if (snapshot.habits.isEmpty()) {
                    androidx.compose.material3.Text("Todavía no hay hábitos. Añade uno que sea realista para ti.", color = mutedColor, fontSize = 12.sp)
                }
                snapshot.habits.forEach { habit ->
                    androidx.compose.foundation.layout.Row(
                        modifier = androidx.compose.ui.Modifier.fillMaxWidth(),
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                    ) {
                        androidx.compose.material3.Checkbox(
                            checked = habitDate in habit.completedDates,
                            onCheckedChange = { checked ->
                                PlannerStore.setHabitCompleted(context, habit.id, habitDate, checked, starterHabits)
                                snapshot = PlannerStore.load(context, starterHabits)
                            },
                            colors = androidx.compose.material3.CheckboxDefaults.colors(checkedColor = accent)
                        )
                        androidx.compose.foundation.layout.Column(modifier = androidx.compose.ui.Modifier.weight(1f)) {
                            androidx.compose.material3.Text(habit.title, color = textColor, fontSize = 13.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold)
                            androidx.compose.material3.Text(
                                if (habitDate in habit.completedDates) "Completado para esta fecha" else "Avanza sin presión",
                                color = mutedColor, fontSize = 11.sp
                            )
                        }
                        androidx.compose.material3.Text(
                            "Quitar", color = mutedColor, fontSize = 11.sp,
                            modifier = androidx.compose.ui.Modifier.clickable {
                                PlannerStore.removeHabit(context, habit.id, starterHabits)
                                snapshot = PlannerStore.load(context, starterHabits)
                            }.padding(5.dp)
                        )
                    }
                }
                androidx.compose.material3.OutlinedTextField(
                    value = newHabit, onValueChange = { newHabit = it.take(80) },
                    modifier = androidx.compose.ui.Modifier.fillMaxWidth(), singleLine = true,
                    label = { androidx.compose.material3.Text("Nuevo hábito", color = mutedColor) },
                    placeholder = { androidx.compose.material3.Text("Una acción pequeña y alcanzable", color = mutedColor) },
                    textStyle = androidx.compose.ui.text.TextStyle(color = textColor)
                )
                androidx.compose.material3.Button(
                    enabled = newHabit.isNotBlank(),
                    onClick = {
                        PlannerStore.addHabit(context, newHabit, starterHabits)
                        snapshot = PlannerStore.load(context, starterHabits)
                        newHabit = ""
                    },
                    colors = androidx.compose.material3.ButtonDefaults.buttonColors(containerColor = accent, contentColor = ink)
                ) { androidx.compose.material3.Text("Añadir hábito") }

                androidx.compose.material3.Text("Tareas con fecha", color = textColor, fontSize = 16.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                androidx.compose.material3.OutlinedTextField(
                    value = newTask, onValueChange = { newTask = it.take(120) },
                    modifier = androidx.compose.ui.Modifier.fillMaxWidth(), singleLine = true,
                    label = { androidx.compose.material3.Text("Tarea o fecha límite", color = mutedColor) },
                    placeholder = { androidx.compose.material3.Text("Ej.: revisar inscripción a un curso", color = mutedColor) },
                    textStyle = androidx.compose.ui.text.TextStyle(color = textColor)
                )
                androidx.compose.material3.OutlinedTextField(
                    value = dueDate, onValueChange = { dueDate = it.take(10); dateError = false },
                    modifier = androidx.compose.ui.Modifier.fillMaxWidth(), singleLine = true, isError = dateError,
                    label = { androidx.compose.material3.Text("Fecha (AAAA-MM-DD)", color = mutedColor) },
                    supportingText = { if (dateError) androidx.compose.material3.Text("Escribe una fecha válida AAAA-MM-DD") },
                    textStyle = androidx.compose.ui.text.TextStyle(color = textColor)
                )
                androidx.compose.material3.OutlinedButton(
                    onClick = { showTaskDatePicker = true },
                    modifier = androidx.compose.ui.Modifier.fillMaxWidth()
                ) { androidx.compose.material3.Text("Elegir fecha con calendario") }
                androidx.compose.material3.Button(
                    enabled = newTask.isNotBlank(),
                    onClick = {
                        val validDate = PlannerRules.normalizeDate(dueDate)
                        if (validDate == null) {
                            dateError = true
                        } else {
                            PlannerStore.addTask(context, newTask, validDate)
                            snapshot = PlannerStore.load(context, starterHabits)
                            newTask = ""
                            dateError = false
                        }
                    },
                    colors = androidx.compose.material3.ButtonDefaults.buttonColors(containerColor = accent, contentColor = ink)
                ) { androidx.compose.material3.Text("Guardar tarea") }
                if (taskList.isEmpty()) {
                    androidx.compose.material3.Text("Aún no tienes tareas con fecha. Añade un plazo o el siguiente paso de una meta.", color = mutedColor, fontSize = 12.sp)
                }
                taskList.forEach { task ->
                    androidx.compose.foundation.layout.Row(
                        modifier = androidx.compose.ui.Modifier.fillMaxWidth(),
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                    ) {
                        androidx.compose.material3.Checkbox(
                            checked = task.completed,
                            onCheckedChange = { checked ->
                                PlannerStore.setTaskCompleted(context, task.id, checked)
                                snapshot = PlannerStore.load(context, starterHabits)
                            },
                            colors = androidx.compose.material3.CheckboxDefaults.colors(checkedColor = accent)
                        )
                        androidx.compose.foundation.layout.Column(modifier = androidx.compose.ui.Modifier.weight(1f)) {
                            androidx.compose.material3.Text(task.title, color = textColor, fontSize = 13.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold)
                            val status = when (PlannerRules.status(task, today)) {
                                PlannerTaskState.COMPLETED -> "Completada"
                                PlannerTaskState.OVERDUE -> "Vencida · reprográmala sin culpa"
                                PlannerTaskState.DUE_TODAY -> "Para hoy"
                                PlannerTaskState.UPCOMING -> "Para " + task.dueDate
                            }
                            androidx.compose.material3.Text(status, color = mutedColor, fontSize = 11.sp)
                        }
                        androidx.compose.material3.Text(
                            "Remove", color = mutedColor, fontSize = 11.sp,
                            modifier = androidx.compose.ui.Modifier.clickable {
                                PlannerStore.removeTask(context, task.id)
                                snapshot = PlannerStore.load(context, starterHabits)
                            }.padding(5.dp)
                        )
                    }
                }
                androidx.compose.material3.Text("Programas, beneficios y fuentes oficiales", color = textColor, fontSize = 16.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                androidx.compose.material3.Text(
                    "Son puntos de partida oficiales. Las reglas, fechas y la elegibilidad pueden cambiar; confirma todo con la entidad.",
                    color = mutedColor, fontSize = 12.sp, lineHeight = 17.sp
                )
                opportunities.forEach { opportunity ->
                    androidx.compose.material3.Card(
                        colors = androidx.compose.material3.CardDefaults.cardColors(containerColor = cardColor),
                        shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp)
                    ) {
                        androidx.compose.foundation.layout.Column(
                            modifier = androidx.compose.ui.Modifier.padding(13.dp),
                            verticalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(6.dp)
                        ) {
                            androidx.compose.material3.Text(opportunity.title, color = textColor, fontSize = 14.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
                            androidx.compose.material3.Text(opportunity.jurisdiction + " · " + opportunity.category, color = accent, fontSize = 11.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold)
                            androidx.compose.material3.Text(opportunity.description, color = mutedColor, fontSize = 12.sp, lineHeight = 17.sp)
                            androidx.compose.material3.Button(
                                onClick = { openExternalUrl(context, opportunity.url, languageCode) },
                                colors = androidx.compose.material3.ButtonDefaults.buttonColors(containerColor = accent, contentColor = ink)
                            ) { androidx.compose.material3.Text("Abrir fuente oficial ↗") }
                            androidx.compose.material3.Text("Catálogo revisado: " + opportunity.reviewedOn, color = mutedColor, fontSize = 10.sp)
                        }
                    }
                }
                androidx.compose.material3.Text(
                    "Se guarda solo en este dispositivo. Este planificador no confirma citas, elegibilidad, inscripciones ni beneficios.",
                    color = mutedColor, fontSize = 11.sp, lineHeight = 16.sp
                )
            }
        }
    }
    if (showHabitDatePicker) {
        val pickerState = rememberDatePickerState(initialSelectedDateMillis = PlannerRules.dateToUtcMillis(habitDate))
        DatePickerDialog(
            onDismissRequest = { showHabitDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    PlannerRules.dateFromUtcMillis(pickerState.selectedDateMillis)?.let { habitDate = it }
                    showHabitDatePicker = false
                }) { androidx.compose.material3.Text("Usar fecha") }
            },
            dismissButton = {
                TextButton(onClick = { showHabitDatePicker = false }) { androidx.compose.material3.Text("Cancelar") }
            }
        ) { DatePicker(state = pickerState) }
    }
    if (showTaskDatePicker) {
        val pickerState = rememberDatePickerState(initialSelectedDateMillis = PlannerRules.dateToUtcMillis(dueDate))
        DatePickerDialog(
            onDismissRequest = { showTaskDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    PlannerRules.dateFromUtcMillis(pickerState.selectedDateMillis)?.let {
                        dueDate = it
                        dateError = false
                    }
                    showTaskDatePicker = false
                }) { androidx.compose.material3.Text("Usar fecha") }
            },
            dismissButton = {
                TextButton(onClick = { showTaskDatePicker = false }) { androidx.compose.material3.Text("Cancelar") }
            }
        ) { DatePicker(state = pickerState) }
    }
}

@androidx.compose.runtime.Composable
private fun rememberStarterHabits(): List<String> = listOf(
    "Planear una prioridad",
    "Dedicar un momento a aprender",
    "Conectar con alguien de confianza"
)
