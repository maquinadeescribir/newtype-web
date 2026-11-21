package com.saw.check

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
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@Composable
fun VetPanel(autoCapture: Boolean = false, onClose: (() -> Unit)? = null) {
    val ctx = LocalContext.current
    var entries by remember { mutableStateOf(VetDirectory.entries) }
    var loading by remember { mutableStateOf(true) }
    var query by remember { mutableStateOf("") }
    var filter by remember { mutableStateOf("all") }
    var queue by remember { mutableStateOf(QueueStore.load(ctx)) }
    var captureFailed by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        try {
            if (VetDirectory.entries.isEmpty()) {
                entries = withContext(Dispatchers.IO) { VetDirectory.fetch() }
            }
            if (autoCapture) {
                val h = runCatching { SawAccessibilityService.captureUsername() }.getOrNull()
                if (h != null) query = h else captureFailed = true
            }
        } catch (_: Exception) {
        } finally {
            loading = false
        }
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

    Column(
        Modifier
            .fillMaxSize()
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFF0F172A))
            .padding(12.dp),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("Creator check", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                Text("v${BuildConfig.VERSION_NAME}", fontSize = 10.sp, color = Color(0xFF64748B))
            }
            Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                TextButton(onClick = { SawAccessibilityService.captureUsername()?.let { query = it } }) {
                    Text("🖼 capture", color = Color(0xFF94A3B8))
                }
                if (onClose != null) {
                    TextButton(onClick = onClose) { Text("✕", color = Color(0xFF94A3B8)) }
                }
            }
        }

        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
            placeholder = { Text("Search a handle or name…") },
            singleLine = true,
        )

        Row(Modifier.padding(top = 6.dp), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            listOf("all" to "All", "genuine" to "✅", "selling" to "⚠️", "scam" to "🚫").forEach { (id, label) ->
                FilterChip(selected = filter == id, onClick = { filter = id }, label = { Text(label) })
            }
        }

        if (loading) {
            Box(Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else if (captureFailed && q.isEmpty()) {
            Column(
                Modifier.fillMaxWidth().weight(1f).padding(top = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text("Couldn't read the screen.", color = Color(0xFF94A3B8))
                Spacer(Modifier.height(6.dp))
                Text("Tap 🖼 capture, or type a handle above.", color = Color(0xFF64748B), fontSize = 13.sp)
            }
        } else if (notFound) {
            Column(
                Modifier.fillMaxWidth().weight(1f).padding(top = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text("Not in the directory yet — probably not vetted.", color = Color(0xFF94A3B8))
                Spacer(Modifier.height(8.dp))
                Button(onClick = {
                    val h = query.trim().removePrefix("@")
                    if (h.isNotBlank() && queue.none { it.lowercase() == h.lowercase() }) {
                        queue = listOf(h) + queue
                        QueueStore.save(ctx, queue)
                    }
                }) { Text("+ queue for vetting") }
            }
        } else {
            LazyColumn(
                Modifier.fillMaxWidth().weight(1f).padding(top = 8.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                items(results) { e -> EntryCard(e) }
            }
        }

        if (queue.isNotEmpty()) {
            HorizontalDivider(Modifier.padding(vertical = 8.dp))
            Text("Queued for vetting (${queue.size})", fontSize = 13.sp, color = Color(0xFF94A3B8))
            Column(Modifier.padding(top = 4.dp), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                queue.forEach { h ->
                    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                        Text("@$h", color = Color.White, fontSize = 13.sp, modifier = Modifier.weight(1f))
                        TextButton(onClick = {
                            queue = queue.filter { it != h }
                            QueueStore.save(ctx, queue)
                        }) { Text("✕", color = Color(0xFF94A3B8)) }
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
            .padding(10.dp),
    ) {
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                Text(e.handle, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                if (e.name.isNotBlank() && e.name.lowercase() != e.handle.lowercase()) {
                    Text(e.name, color = Color(0xFF94A3B8), fontSize = 12.sp)
                }
            }
            Text(
                label,
                color = badgeColor,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier
                    .background(badgeColor.copy(alpha = 0.15f), RoundedCornerShape(999.dp))
                    .padding(horizontal = 7.dp, vertical = 2.dp),
            )
        }
        if (e.focus.isNotBlank()) {
            Text(e.focus, color = Color(0xFFE2E8F0), fontSize = 13.sp, modifier = Modifier.padding(top = 4.dp))
        }
        if (e.monetisation.isNotBlank()) {
            Text("💰 ${e.monetisation}", color = Color(0xFF94A3B8), fontSize = 11.sp, modifier = Modifier.padding(top = 3.dp))
        }
        if (e.notes.isNotBlank()) {
            Text(e.notes, color = Color(0xFF94A3B8), fontSize = 11.sp, maxLines = 2, modifier = Modifier.padding(top = 3.dp))
        }
    }
}
