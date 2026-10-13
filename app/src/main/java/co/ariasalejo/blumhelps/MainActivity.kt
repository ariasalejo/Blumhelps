package co.ariasalejo.blumhelps

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { BlumHelpsApp() }
    }
}

private val Ink = Color(0xFF173629)
private val Panel = Color(0xFF22392D)
private val Mint = Color(0xFFD6F277)
private val Violet = Color(0xFFFFC857)
private val LightBg = Color(0xFFF5F7F0)

private data class ResourceCard(
    val icon: String,
    val title: String,
    val description: String,
    val category: String,
    val status: String,
    val officialUrl: String? = null
)

@Composable
private fun BlumHelpsApp() {
    var dark by remember { mutableStateOf(false) }
    var search by remember { mutableStateOf("") }
    var selected by remember { mutableStateOf("Todo") }
    var opened by remember { mutableStateOf<ResourceCard?>(null) }
    val context = LocalContext.current

    val resources = listOf(
        ResourceCard("🤝", "Encontrar apoyo", "Orientación para buscar servicios profesionales y redes comunitarias.", "Apoyo", "Consultar fuente oficial", "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/convivencia-desarrollo-humano-sustancias-psicoactivas.aspx"),
        ResourceCard("🧠", "Bienestar emocional", "Información educativa y pasos pequeños para cuidar tu bienestar.", "Apoyo", "Consultar fuente oficial", "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx"),
        ResourceCard("🎓", "Aprender algo nuevo", "Explora formación y cursos; verifica requisitos y fechas en la fuente oficial.", "Formación", "Consultar oferta oficial", "https://betowa.sena.edu.co/"),
        ResourceCard("💼", "Empleo con propósito", "Preparación de hoja de vida, búsqueda laboral y habilidades para el trabajo.", "Empleo", "Consultar oferta oficial", "https://ape.sena.edu.co/Paginas/APE.aspx"),
        ResourceCard("🌱", "Mis pequeños pasos", "Define una meta alcanzable. El progreso no tiene que ser perfecto.", "Progreso", "Privado en este dispositivo"),
        ResourceCard("🔎", "Directorio oficial de IPS", "Busca prestadores y confirma servicios, habilitación, costos y cobertura directamente.", "Recursos", "Consultar directorio oficial", "https://prestadores.minsalud.gov.co/directorio/consultaIPS.aspx?pageTitle=Directorio")
    )
    val colors = if (dark) darkColorScheme(
        primary = Mint, secondary = Violet, background = Ink, surface = Panel,
        onBackground = Color(0xFFF3F6FF), onSurface = Color(0xFFF3F6FF)
    ) else lightColorScheme(
        primary = Color(0xFF235D42), secondary = Color(0xFF8A5B12),
        background = LightBg, surface = Color.White,
        onBackground = Color(0xFF20362B), onSurface = Color(0xFF20362B)
    )

    MaterialTheme(colorScheme = colors) {
        Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
            Column(Modifier.fillMaxSize()) {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(start = 18.dp, end = 18.dp, top = 14.dp, bottom = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    item {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Box(
                                Modifier.size(46.dp).clip(RoundedCornerShape(15.dp)).background(
                                    Brush.linearGradient(listOf(Mint, Violet))
                                ).border(1.dp, Color.White.copy(alpha = 0.28f), RoundedCornerShape(15.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("B", color = Ink, fontSize = 27.sp, fontWeight = FontWeight.Black)
                            }
                            Column(Modifier.weight(1f)) {
                                Text("BLUMHELPS", fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 2.sp)
                                Text("BIENESTAR • OPORTUNIDADES • COMUNIDAD", fontSize = 9.sp, color = MaterialTheme.colorScheme.primary, letterSpacing = 1.sp)
                            }
                            Switch(checked = dark, onCheckedChange = { dark = it })
                        }
                    }
                    item {
                        Box(
                            Modifier.fillMaxWidth().clip(RoundedCornerShape(28.dp)).background(
                                Brush.linearGradient(
                                    listOf(Color(0xFF194D3B), Color(0xFF28664C), if (dark) Ink else Color(0xFF397655))
                                )
                            ).border(1.dp, Mint.copy(alpha = 0.24f), RoundedCornerShape(28.dp)).padding(22.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                Text("COLOMBIA · APOYO Y OPORTUNIDADES", color = Mint, fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                                Text("Encuentra tu próximo paso.", fontSize = 30.sp, lineHeight = 35.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                                Text("Rutas claras para salud, formación, empleo y apoyos públicos. Empieza por lo que necesitas hoy.", color = Color(0xFFE8F0E8), fontSize = 14.sp, lineHeight = 21.sp)
                                Text("FUENTES OFICIALES · PLAN PERSONAL · A TU RITMO", color = Mint, fontSize = 9.sp, fontWeight = FontWeight.Bold, letterSpacing = 0.4.sp)
                                Row(horizontalArrangement = Arrangement.spacedBy(9.dp), verticalAlignment = Alignment.CenterVertically) {
                                    Surface(color = Mint, shape = RoundedCornerShape(14.dp), modifier = Modifier.clickable { selected = "Formación" }) {
                                        Text("Explorar oportunidades ↗", color = Ink, fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 12.dp, vertical = 11.dp))
                                    }
                                    Surface(color = Color.White.copy(alpha = 0.10f), shape = RoundedCornerShape(14.dp), modifier = Modifier.border(1.dp, Color.White.copy(alpha = 0.28f), RoundedCornerShape(14.dp)).clickable { selected = "Apoyo" }) {
                                        Text("Buscar apoyo", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(horizontal = 12.dp, vertical = 11.dp))
                                    }
                                }
                            }
                        }
                    }
                    item {
                        PlannerPanel(
                            heading = "Mi plan, a mi ritmo",
                            intro = "Organiza hábitos y fechas clave. Tus datos permanecen en este dispositivo.",
                            accent = MaterialTheme.colorScheme.primary,
                            cardColor = MaterialTheme.colorScheme.surface,
                            textColor = MaterialTheme.colorScheme.onSurface,
                            mutedColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.72f),
                            languageCode = "es"
                        )
                    }
                    item {
                        Text("¿Qué necesitas hoy?", fontSize = 21.sp, fontWeight = FontWeight.Bold)
                        Spacer(Modifier.height(8.dp))
                        OutlinedTextField(
                            value = search, onValueChange = { search = it },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(18.dp),
                            singleLine = true,
                            placeholder = { Text("Buscar apoyo, cursos, empleo…") },
                            leadingIcon = { Text("⌕", fontSize = 22.sp) }
                        )
                    }
                    item {
                        Row(Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            listOf("Todo", "Apoyo", "Formación", "Empleo", "Progreso", "Recursos").forEach { category ->
                                val active = selected == category
                                Surface(
                                    shape = RoundedCornerShape(50),
                                    color = if (active) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface,
                                    modifier = Modifier.clickable { selected = category }
                                ) {
                                    Text(
                                        category, modifier = Modifier.padding(horizontal = 12.dp, vertical = 9.dp),
                                        color = if (active) { if (dark) Ink else Color.White } else MaterialTheme.colorScheme.onSurface,
                                        fontSize = 12.sp, fontWeight = FontWeight.SemiBold
                                    )
                                }
                            }
                        }
                    }
                    if (opened != null) {
                        item {
                            val resource = opened!!
                            Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(24.dp)) {
                                Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                    Text(resource.icon, fontSize = 32.sp)
                                    Text(resource.title, fontSize = 23.sp, fontWeight = FontWeight.Bold)
                                    Text(resource.description, fontSize = 15.sp, lineHeight = 22.sp)
                                    Text("Estado: ${resource.status}", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
                                    Text("La fuente oficial es un punto de partida; no confirma cupos, elegibilidad, costos ni atención inmediata.", fontSize = 12.sp, lineHeight = 18.sp)
                                    if (resource.officialUrl != null) {
                                        Button(onClick = { context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(resource.officialUrl))) }) { Text("Abrir fuente oficial ↗") }
                                    }
                                    Button(onClick = { opened = null }) { Text("Volver a explorar") }
                                }
                            }
                        }
                    }
                    val visible = resources.filter {
                        (selected == "Todo" || it.category == selected) &&
                            (search.isBlank() || it.title.contains(search, true) || it.description.contains(search, true) || it.category.contains(search, true) || it.status.contains(search, true))
                    }
                    items(visible, key = { it.title }) { resource ->
                        AnimatedVisibility(visible = true, enter = fadeIn() + slideInVertically(initialOffsetY = { it / 8 })) {
                            Card(
                                modifier = Modifier.fillMaxWidth().clickable { opened = resource },
                                shape = RoundedCornerShape(22.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                elevation = CardDefaults.cardElevation(defaultElevation = if (dark) 0.dp else 2.dp)
                            ) {
                                Row(Modifier.padding(17.dp), horizontalArrangement = Arrangement.spacedBy(14.dp), verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        Modifier.size(52.dp).clip(RoundedCornerShape(17.dp)).background(
                                            Brush.linearGradient(listOf(Mint.copy(alpha = 0.17f), Violet.copy(alpha = 0.18f)))
                                        ), contentAlignment = Alignment.Center
                                    ) { Text(resource.icon, fontSize = 25.sp) }
                                    Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(5.dp)) {
                                        Text(resource.title, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                                        Text(resource.description, fontSize = 12.sp, lineHeight = 17.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.76f))
                                        Text(resource.status.uppercase(), fontSize = 9.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold, letterSpacing = 0.8.sp)
                                    }
                                    Text("›", fontSize = 27.sp, color = MaterialTheme.colorScheme.secondary)
                                }
                            }
                        }
                    }
                    if (visible.isEmpty()) {
                        item {
                            Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), shape = RoundedCornerShape(22.dp)) {
                                Column(Modifier.fillMaxWidth().padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                    Text("No encontramos resultados", fontSize = 17.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                                    Text("Prueba otra palabra o restablece los filtros para volver a explorar.", fontSize = 13.sp, lineHeight = 19.sp, textAlign = TextAlign.Center, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f))
                                    Button(onClick = { search = ""; selected = "Todo"; opened = null }) { Text("Limpiar búsqueda y filtros") }
                                }
                            }
                        }
                    }
                    item {
                        Card(shape = RoundedCornerShape(22.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
                            Column(Modifier.padding(17.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text("🛡️  Primero, tu seguridad", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Text("BlumHelps es una herramienta de orientación, no un servicio clínico ni de emergencias. Ante un peligro inmediato, contacta los servicios de emergencia locales.", fontSize = 12.sp, lineHeight = 18.sp)
                                Text("Privacidad: tus búsquedas y metas no se envían a un servidor en esta versión.", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                            }
                        }
                    }
                    item {
                        Text("BLUMHELPS · COLOMBIA\nConstruida con respeto, evidencia y esperanza.", modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), textAlign = TextAlign.Center, fontSize = 10.sp, lineHeight = 16.sp, color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f))
                    }
                }
                Row(
                    Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surface).padding(horizontal = 10.dp, vertical = 9.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly, verticalAlignment = Alignment.CenterVertically
                ) {
                    listOf("⌂" to "Inicio", "♡" to "Apoyo", "✦" to "Progreso", "◎" to "Recursos").forEach { (icon, label) ->
                        Column(
                            Modifier.clip(RoundedCornerShape(12.dp)).clickable {
                                selected = when (label) { "Apoyo" -> "Apoyo"; "Progreso" -> "Progreso"; "Recursos" -> "Recursos"; else -> "Todo" }
                                opened = null
                            }.padding(horizontal = 12.dp, vertical = 4.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(icon, color = MaterialTheme.colorScheme.primary, fontSize = 20.sp)
                            Text(label, fontSize = 10.sp)
                        }
                    }
                }
            }
        }
    }
}
