package co.ariasalejo.blumhelps

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MaterialTheme { InicioBlumHelps() } }
    }
}

private data class AreaApoyo(val titulo: String, val descripcion: String)

@Composable
private fun InicioBlumHelps() {
    val areas = listOf(
        AreaApoyo("Encontrar apoyo", "Rutas hacia atención profesional, salud mental y redes comunitarias. El directorio verificado está en desarrollo."),
        AreaApoyo("Estudiar y aprender", "Formación, cursos y oportunidades educativas; cada convocatoria debe verificarse."),
        AreaApoyo("Empleo y propósito", "Orientación laboral, preparación de hoja de vida, voluntariado y actividades significativas."),
        AreaApoyo("Un paso a la vez", "Elige metas personales y realistas. Una recaída no te quita dignidad ni derecho a recibir apoyo."),
        AreaApoyo("Esperanza con evidencia", "La información sanitaria debe tener fuentes confiables y límites claros. El acompañamiento espiritual es voluntario.")
    )
    Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("BlumHelps", style = MaterialTheme.typography.headlineLarge)
                    Text("Una segunda oportunidad", style = MaterialTheme.typography.titleMedium)
                    Text("Un prototipo para conectar apoyo, formación, empleo y comunidad en Colombia. No es un servicio clínico ni de emergencias.")
                }
            }
            items(areas) { area ->
                Card(Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(area.titulo, style = MaterialTheme.typography.titleMedium)
                        Text(area.descripcion, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}
