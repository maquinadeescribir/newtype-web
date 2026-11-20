package com.saw.check

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(colorScheme = darkColorScheme()) {
                val ctx = LocalContext.current
                var entries by remember { mutableStateOf(VetDirectory.entries) }
                var loading by remember { mutableStateOf(true) }
                var query by remember { mutableStateOf("") }
                var filter by remember { mutableStateOf("all") }
                var queue by remember { mutableStateOf(QueueStore.load(ctx)) }

                LaunchedEffect(Unit) {
                    entries = VetDirectory.fetch()
                    loading = false
                }

                val q = query.trim().lowercase()
                val results = entries.filter { e ->
                    (filter == "all" || e.bucket == filter) &&
                        (q.isEmpty() ||
                            e.handle.lowercase().contains(q) ||
                            e.name.lowercase().contains(q) ||
                            e.focus.lowercase().contains(q))
                }
                val notFound = q.isNotEmpty() && results.isEmpty()

                Column(Modifier.fillMaxSize().padding(16.dp)) {
                    Row(
                        Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text("Creator check", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Button(onClick = {
                            if (!Settings.canDrawOverlays(ctx)) {
                                val i = Intent(
                                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                    Uri.parse("package:${ctx.packageName}"),
                                )
                                ctx.startActivity(i)
                            } else {
                                OverlayService.start(ctx)
                            }
                        }) {
                            Text(if (Settings.canDrawOverlays(ctx)) "Start floating button" else "Grant overlay permission")
                        }
                    }

                    OutlinedTextField(
                        value = query,
                        onValueChange = { query = it },
                        modifier = Modifier.fillMaxWidth().padding(top = 12.dp),
                        placeholder = { Text("Search a handle or name…") },
                        singleLine = true,
                    )

                    Row(Modifier.padding(top = 8.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        listOf(
                            "all" to "All",
                            "genuine" to "✅ Genuine",
                            "selling" to "⚠️ Selling",
                            "scam" to "🚫 Scam",
                        ).forEach { (id, label) ->
                            FilterChip(selected = filter == id, onClick = { filter = id }, label = { Text(label) })
                        }
                    }

                    if (loading) {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator()
                        }
                    } else if (notFound) {
                        Column(
                            Modifier.fillMaxWidth().padding(top = 24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Text("Not in the directory yet — probably not vetted.", color = Color(0xFF94A3B8))
                            Spacer(Modifier.height(10.dp))
                            Button(onClick = {
                                val h = query.trim().removePrefix("@")
                                if (h.isNotBlank() && queue.none { it.lowercase() == h.lowercase() }) {
                                    queue = listOf(h) + queue
                                    QueueStore.save(ctx, queue)
                                }
                            }) {
                                Text("+ queue for vetting")
                            }
                        }
                    } else {
                        LazyColumn(
                            Modifier.padding(top = 8.dp).weight(1f),
                            verticalArrangement = Arrangement.spacedBy(8.dp),
                        ) {
                            items(results) { e -> EntryCard(e) }
                        }
                    }

                    if (queue.isNotEmpty()) {
                        HorizontalDivider(Modifier.padding(vertical = 12.dp))
                        Text("Queued for vetting (${queue.size})", fontSize = 14.sp, color = Color(0xFF94A3B8))
                        Column(Modifier.padding(top = 6.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            queue.forEach { h ->
                                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                                    Text("@$h", color = Color.White, modifier = Modifier.weight(1f))
                                    TextButton(onClick = {
                                        queue = queue.filter { it != h }
                                        QueueStore.save(ctx, queue)
                                    }) {
                                        Text("✕", color = Color(0xFF94A3B8))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun EntryCard(e: VetEntry) {
    val badgeColor: Color
    val label: String
    when (e.bucket) {
        "genuine" -> {
            badgeColor = Color(0xFF4ADE80)
            label = e.verdict.ifBlank { "✅ Genuine" }
        }
        "selling" -> {
            badgeColor = Color(0xFFFACC15)
            label = e.verdict.ifBlank { "⚠️ Selling" }
        }
        "scam" -> {
            badgeColor = Color(0xFFF87171)
            label = e.verdict.ifBlank { "🚫 Scam" }
        }
        else -> {
            badgeColor = Color(0xFF94A3B8)
            label = e.verdict.ifBlank { "— unvetted" }
        }
    }

    Column(
        Modifier
            .fillMaxWidth()
            .background(Color(0xFF1E293B), RoundedCornerShape(10.dp))
            .padding(12.dp),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text(e.handle, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                if (e.name.isNotBlank() && e.name.lowercase() != e.handle.lowercase()) {
                    Text(e.name, color = Color(0xFF94A3B8), fontSize = 13.sp)
                }
            }
            Text(
                label,
                color = badgeColor,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier
                    .background(badgeColor.copy(alpha = 0.15f), RoundedCornerShape(999.dp))
                    .padding(horizontal = 8.dp, vertical = 3.dp),
            )
        }
        if (e.focus.isNotBlank()) {
            Text(e.focus, color = Color(0xFFE2E8F0), fontSize = 14.sp, modifier = Modifier.padding(top = 5.dp))
        }
        if (e.monetisation.isNotBlank()) {
            Text("💰 ${e.monetisation}", color = Color(0xFF94A3B8), fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
        }
        if (e.notes.isNotBlank()) {
            Text(e.notes, color = Color(0xFF94A3B8), fontSize = 12.sp, maxLines = 3, modifier = Modifier.padding(top = 4.dp))
        }
        if (e.platform.isNotBlank() || e.followers.isNotBlank()) {
            val meta = listOf(e.platform, e.followers).filter { it.isNotBlank() }.joinToString(" · ")
            Text("📱 $meta", color = Color(0xFF94A3B8), fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
        }
    }
}
