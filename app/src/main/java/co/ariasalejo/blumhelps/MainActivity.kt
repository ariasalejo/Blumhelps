package co.ariasalejo.blumhelps

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { BlumHelpsApp() }
    }
}

private val Forest = Color(0xFF153C3B)
private val Deep = Color(0xFF10292F)
private val Lime = Color(0xFFC9EF8C)
private val Mint = Color(0xFFD9F1D9)
private val Paper = Color(0xFFF3F7F2)
private val Muted = Color(0xFF728782)

private data class ResourceCard(
    val icon: String,
    val title: String,
    val description: String,
    val category: String,
    val status: String,
    val officialUrl: String? = null
)
private data class NativeTab(val title: String, val icon: String)

@Composable
private fun BlumHelpsApp() {
    var dark by remember { mutableStateOf(false) }
    var activeScreen by remember { mutableStateOf("Inicio") }
    var search by remember { mutableStateOf("") }
    var selected by remember { mutableStateOf("Todo") }
    var opened by remember { mutableStateOf<ResourceCard?>(null) }
    val context = LocalContext.current

    val tabs = listOf(
        NativeTab("Inicio", "⌂"),
        NativeTab("Mi plan", "◷"),
        NativeTab("Biblioteca", "✧"),
        NativeTab("Apoyo", "♡"),
        NativeTab("Mi progreso", "⌁")
    )
    val resources = listOf(
        ResourceCard("♡", "Encontrar apoyo", "Orientación del Ministerio de Salud para conocer posibles rutas de atención por consumo de sustancias.", "Apoyo", "Fuente institucional", "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/convivencia-desarrollo-humano-sustancias-psicoactivas.aspx"),
        ResourceCard("✳", "Bienestar emocional", "Consulta el canal oficial y confirma su cobertura, disponibilidad y horario actual.", "Apoyo", "Verificar canal oficial", "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx"),
        ResourceCard("＋", "Directorio de prestadores de salud", "Localiza prestadores y confirma directamente los servicios y la cobertura.", "Recursos", "Directorio oficial", "https://prestadores.minsalud.gov.co/directorio/consultaIPS.aspx?pageTitle=Directorio"),
        ResourceCard("▤", "Formación SENA", "Explora cursos e inscripciones. Los requisitos y fechas dependen de la convocatoria.", "Formación", "Oferta pública", "https://betowa.sena.edu.co/"),
        ResourceCard("↗", "Agencia Pública de Empleo", "Consulta servicios públicos de orientación e intermediación laboral.", "Empleo", "Servicio público", "https://ape.sena.edu.co/Paginas/APE.aspx"),
        ResourceCard("◎", "Inclusión productiva", "Consulta información institucional; no se garantiza elegibilidad ni entrega de beneficios.", "Recursos", "Consultar condiciones", "https://prosperidadsocial.gov.co/sgpp/inclusion-productiva/"),
        ResourceCard("⌂", "Orientación para familias", "Consulta información institucional para familias y cuidadores.", "Apoyo", "Verificar fuente oficial", "https://www.icbf.gov.co/"),
        ResourceCard("🌱", "Mis pequeños pasos", "Define una meta alcanzable. El progreso no tiene que ser perfecto.", "Progreso", "Privado en este dispositivo")
    )

    val colors = if (dark) darkColorScheme(
        primary = Lime, secondary = Mint, background = Deep, surface = Color(0xFF1B363A),
        onBackground = Color(0xFFF1F7F0), onSurface = Color(0xFFF1F7F0)
    ) else lightColorScheme(
        primary = Forest, secondary = Color(0xFF6D9279), background = Paper,
        surface = Color.White, onBackground = Color(0xFF203735), onSurface = Color(0xFF203735)
    )
    val relevantResources = resources.filter { resource ->
        val sectionMatches = when (activeScreen) {
            "Biblioteca" -> resource.category == "Formación"
            "Apoyo" -> resource.category == "Apoyo" || resource.category == "Recursos"
            else -> false
        }
        sectionMatches &&
            (selected == "Todo" || resource.category == selected) &&
            (search.isBlank() || resource.title.contains(search, true) ||
                resource.description.contains(search, true) || resource.category.contains(search, true))
    }

    MaterialTheme(colorScheme = colors) {
        Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
            Column(Modifier.fillMaxSize()) {
                Row(
                    Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surface)
                        .border(width = 1.dp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.06f))
                        .padding(horizontal = 18.dp, vertical = 13.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(11.dp)
                ) {
                    Box(
                        Modifier.size(43.dp).clip(RoundedCornerShape(15.dp))
                            .background(Brush.linearGradient(listOf(Lime, Mint))),
                        contentAlignment = Alignment.Center
                    ) { Text("b.", fontSize = 24.sp, color = Deep, fontWeight = FontWeight.Black) }
                    Column(Modifier.weight(1f)) {
                        Text("BLUMHELPS", fontSize = 17.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.7.sp)
                        Text("COLOMBIA · BIENESTAR Y HÁBITOS", color = MaterialTheme.colorScheme.primary, fontSize = 8.sp, letterSpacing = 1.sp)
                    }
                    Switch(checked = dark, onCheckedChange = { dark = it })
                }

                LazyColumn(
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 17.dp, bottom = 20.dp),
                    verticalArrangement = Arrangement.spacedBy(13.dp)
                ) {
                    when (activeScreen) {
                        "Inicio" -> {
                            item {
                                Box(
                                    Modifier.fillMaxWidth().clip(RoundedCornerShape(28.dp))
                                        .background(Brush.linearGradient(listOf(Deep, Forest, Color(0xFF2B6A61))))
                                        .border(1.dp, Lime.copy(alpha = 0.25f), RoundedCornerShape(28.dp))
                                        .padding(23.dp)
                                ) {
                                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                        Text("UN NUEVO DÍA, SIN PRESIÓN", color = Lime, fontSize = 9.sp, letterSpacing = 1.5.sp, fontWeight = FontWeight.Bold)
                                        Text("No tienes que resolverlo todo hoy.", color = Color.White, fontSize = 30.sp, lineHeight = 35.sp, fontWeight = FontWeight.ExtraBold)
                                        Text("Un espacio para reconstruir rutinas, cuidar tu bienestar y encontrar apoyo confiable sin juicios.", color = Color(0xFFE0EEE6), fontSize = 13.sp, lineHeight = 20.sp)
                                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                                            Surface(color = Lime, shape = RoundedCornerShape(13.dp), modifier = Modifier.clickable { activeScreen = "Mi plan" }) {
                                                Text("Diseñar mi día ↗", color = Deep, fontWeight = FontWeight.Bold, fontSize = 11.sp, modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp))
                                            }
                                            Surface(color = Color.White.copy(alpha = 0.10f), shape = RoundedCornerShape(13.dp), modifier = Modifier.border(1.dp, Color.White.copy(alpha = 0.25f), RoundedCornerShape(13.dp)).clickable { activeScreen = "Apoyo" }) {
                                                Text("Encontrar apoyo", color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 11.sp, modifier = Modifier.padding(horizontal = 12.dp, vertical = 12.dp))
                                            }
                                        }
                                    }
                                }
                            }
                            item {
                                Text("Tu próximo paso puede ser pequeño", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                                Text("Elige qué necesitas ahora. No hay una ruta obligatoria.", fontSize = 12.sp, color = Muted)
                            }
                            item {
                                Row(horizontalArrangement = Arrangement.spacedBy(9.dp)) {
                                    NativeShortcut("◷", "Mi plan", "Hábitos y fechas", Modifier.weight(1f)) { activeScreen = "Mi plan" }
                                    NativeShortcut("✧", "Biblioteca", "Aprender a tu ritmo", Modifier.weight(1f)) { activeScreen = "Biblioteca" }
                                }
                            }
                            item {
                                Card(
                                    shape = RoundedCornerShape(20.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                                ) {
                                    Column(Modifier.padding(17.dp), verticalArrangement = Arrangement.spacedBy(7.dp)) {
                                        Text("✳  Un recordatorio amable", color = MaterialTheme.colorScheme.primary, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                        Text("Una recaída o un día difícil no borra tu esfuerzo. Puedes pausar, buscar apoyo o volver a un paso sencillo.", fontSize = 12.sp, lineHeight = 18.sp)
                                        Text("Tus hábitos y fechas se guardan localmente en el dispositivo.", color = MaterialTheme.colorScheme.primary, fontSize = 10.sp)
                                    }
                                }
                            }
                        }
                        "Mi plan" -> item {
                            PlannerPanel(
                                heading = "Mi plan, a mi ritmo",
                                intro = "Crea hábitos, revisa fechas y registra los pasos que elegiste. Puedes pausar o ajustar sin perder el historial.",
                                accent = MaterialTheme.colorScheme.primary,
                                cardColor = MaterialTheme.colorScheme.surface,
                                textColor = MaterialTheme.colorScheme.onSurface,
                                mutedColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.72f),
                                languageCode = "es"
                            )
                        }
                        "Mi progreso" -> {
                            item {
                                Text("Tu camino no es una carrera", fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
                                Text("El progreso significa lo que te ayudó a sostenerte, no una racha perfecta.", fontSize = 13.sp, lineHeight = 19.sp, color = Muted)
                            }
                            item {
                                PlannerPanel(
                                    heading = "Tu recorrido personal",
                                    intro = "Consulta registros por fecha y hábitos explorados. Los días sin registros no son fracasos.",
                                    accent = MaterialTheme.colorScheme.primary,
                                    cardColor = MaterialTheme.colorScheme.surface,
                                    textColor = MaterialTheme.colorScheme.onSurface,
                                    mutedColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.72f),
                                    languageCode = "es"
                                )
                            }
                        }
                        "Biblioteca", "Apoyo" -> {
                            item {
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Text(if (activeScreen == "Biblioteca") "Aprender también es cuidarte" else "Ayuda confiable, sin promesas vacías", fontSize = 21.sp, fontWeight = FontWeight.Bold)
                                    Text(if (activeScreen == "Biblioteca") "Catálogo de formación y aprendizaje público." else "Fuentes institucionales para comenzar. Verifica cobertura, costo, fechas y disponibilidad con cada entidad.", fontSize = 12.sp, lineHeight = 18.sp, color = Muted)
                                    OutlinedTextField(
                                        value = search, onValueChange = { search = it },
                                        modifier = Modifier.fillMaxWidth(), singleLine = true,
                                        shape = RoundedCornerShape(16.dp),
                                        placeholder = { Text("Buscar recursos...") },
                                        leadingIcon = { Text("⌕", fontSize = 22.sp) }
                                    )
                                }
                            }
                            item {
                                Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    (if (activeScreen == "Biblioteca") listOf("Todo", "Formación") else listOf("Todo", "Apoyo", "Recursos")).forEach { category ->
                                        val active = selected == category
                                        Surface(
                                            color = if (active) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface,
                                            shape = RoundedCornerShape(50),
                                            modifier = Modifier.clickable { selected = category }
                                        ) {
                                            Text(category, color = if (active) Color.White else MaterialTheme.colorScheme.onSurface, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(horizontal = 13.dp, vertical = 9.dp))
                                        }
                                    }
                                }
                            }
                            if (opened != null) {
                                item {
                                    val resource = opened!!
                                    Card(shape = RoundedCornerShape(20.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                                        Column(Modifier.padding(17.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                            Text(resource.icon, fontSize = 28.sp)
                                            Text(resource.title, fontSize = 19.sp, fontWeight = FontWeight.Bold)
                                            Text(resource.description, fontSize = 13.sp, lineHeight = 19.sp)
                                            Text("Fuente: " + resource.status, fontSize = 11.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
                                            Text("El enlace es un punto de partida; no confirma cupos, elegibilidad, costo ni atención inmediata.", fontSize = 11.sp, lineHeight = 16.sp, color = Muted)
                                            resource.officialUrl?.let { url ->
                                                Button(onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) }) { Text("Consultar fuente oficial ↗") }
                                            }
                                            OutlinedButton(onClick = { opened = null }) { Text("Volver al catálogo") }
                                        }
                                    }
                                }
                            }
                            items(relevantResources, key = { it.title }) { resource ->
                                Card(
                                    modifier = Modifier.fillMaxWidth().clickable { opened = resource },
                                    shape = RoundedCornerShape(19.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                                ) {
                                    Row(Modifier.padding(15.dp), horizontalArrangement = Arrangement.spacedBy(13.dp), verticalAlignment = Alignment.CenterVertically) {
                                        Box(Modifier.size(44.dp).clip(RoundedCornerShape(14.dp)).background(Brush.linearGradient(listOf(Lime.copy(alpha = 0.35f), Mint.copy(alpha = 0.6f)))), contentAlignment = Alignment.Center) {
                                            Text(resource.icon, fontSize = 22.sp, color = Forest, fontWeight = FontWeight.Bold)
                                        }
                                        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                                            Text(resource.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                            Text(resource.description, fontSize = 11.sp, lineHeight = 16.sp, color = Muted)
                                            Text(resource.category.uppercase() + " · " + resource.status.uppercase(), fontSize = 8.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold, letterSpacing = 0.6.sp)
                                        }
                                        Text("›", fontSize = 24.sp, color = MaterialTheme.colorScheme.secondary)
                                    }
                                }
                            }
                            if (relevantResources.isEmpty()) {
                                item {
                                    Card(shape = RoundedCornerShape(18.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                                        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                            Text("No encontramos resultados", fontWeight = FontWeight.Bold)
                                            Text("Prueba otra palabra o limpia el filtro.", fontSize = 12.sp, color = Muted, textAlign = TextAlign.Center)
                                            Button(onClick = { search = ""; selected = "Todo"; opened = null }) { Text("Limpiar búsqueda") }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    item {
                        Text("BLUMHELPS · COLOMBIA  •  SIN JUICIOS, SIN PROMESAS VACÍAS", modifier = Modifier.fillMaxWidth().padding(top = 12.dp, bottom = 4.dp), textAlign = TextAlign.Center, fontSize = 9.sp, color = Muted)
                    }
                }

                Row(
                    Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surface)
                        .border(width = 1.dp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.07f))
                        .padding(horizontal = 4.dp, vertical = 7.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    tabs.forEach { tab ->
                        Column(
                            Modifier.weight(1f).clip(RoundedCornerShape(13.dp))
                                .background(if (activeScreen == tab.title) MaterialTheme.colorScheme.primary.copy(alpha = 0.10f) else Color.Transparent)
                                .clickable { activeScreen = tab.title; search = ""; selected = "Todo"; opened = null }
                                .padding(vertical = 7.dp, horizontal = 2.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(3.dp)
                        ) {
                            Text(tab.icon, color = if (activeScreen == tab.title) MaterialTheme.colorScheme.primary else Muted, fontSize = 19.sp)
                            Text(tab.title, color = if (activeScreen == tab.title) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.72f), fontSize = 9.sp, fontWeight = if (activeScreen == tab.title) FontWeight.Bold else FontWeight.Medium, textAlign = TextAlign.Center)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun NativeShortcut(icon: String, title: String, summary: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Card(
        modifier = modifier.clickable(onClick = onClick),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(7.dp)) {
            Text(icon, color = MaterialTheme.colorScheme.primary, fontSize = 23.sp)
            Text(title, color = MaterialTheme.colorScheme.onSurface, fontWeight = FontWeight.Bold, fontSize = 13.sp)
            Text(summary, color = Muted, fontSize = 11.sp, lineHeight = 15.sp)
        }
    }
}
