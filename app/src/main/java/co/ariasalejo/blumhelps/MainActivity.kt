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
        setContent { MaterialTheme { ResourceHome() } }
    }
}

private data class ResourceArea(val title: String, val description: String)

@Composable
private fun ResourceHome() {
    val areas = listOf(
        ResourceArea("Support", "Routes to public and community support. A verified directory is not available yet."),
        ResourceArea("Education", "Learning and training resources with clear source information — planned."),
        ResourceArea("Employment", "Job-search guidance and legitimate employment resources — planned."),
        ResourceArea("Verified resources", "Listings must show their source and review date before being called verified.")
    )
    Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) { padding ->
        LazyColumn(Modifier.fillMaxSize().padding(padding), contentPadding = PaddingValues(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("BlumHelps", style = MaterialTheme.typography.headlineLarge)
                    Text("Support · Education · Employment", style = MaterialTheme.typography.titleMedium)
                    Text("A Colombia-focused resource project. Listings will only be labeled verified after source and review date checks.")
                }
            }
            items(areas) { area ->
                Card(Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(area.title, style = MaterialTheme.typography.titleMedium)
                        Text(area.description, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}
