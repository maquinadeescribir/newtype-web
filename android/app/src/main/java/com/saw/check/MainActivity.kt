package com.saw.check

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    private val tick = mutableStateOf(0)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(colorScheme = darkColorScheme()) {
                SetupScreen(tick.value)
            }
        }
    }

    override fun onResume() {
        super.onResume()
        tick.value++
    }
}

@Composable
private fun SetupScreen(@Suppress("UNUSED_PARAMETER") refreshKey: Int) {
    val ctx = LocalContext.current
    val canDraw = Settings.canDrawOverlays(ctx)
    val accEnabled = SawAccessibilityService.isEnabled(ctx)

    Column(Modifier.fillMaxSize().padding(20.dp)) {
        Text("Saw Check", fontSize = 26.sp, fontWeight = FontWeight.Bold, color = Color.White)
        Text("Floating creator check — floats over every app", fontSize = 14.sp, color = Color(0xFF94A3B8))
        Spacer(Modifier.height(20.dp))

        StatusRow("Overlay permission", canDraw)
        StatusRow("Screen username capture", accEnabled)
        Spacer(Modifier.height(20.dp))

        if (!canDraw) {
            Button(
                onClick = {
                    ctx.startActivity(
                        Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${ctx.packageName}")),
                    )
                },
                modifier = Modifier.fillMaxWidth(),
            ) { Text("1 · Grant overlay permission") }
            Spacer(Modifier.height(8.dp))
        }

        if (!accEnabled) {
            Button(
                onClick = { ctx.startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)) },
                modifier = Modifier.fillMaxWidth(),
            ) { Text("2 · Enable screen capture") }
            Spacer(Modifier.height(8.dp))
        }

        if (canDraw && accEnabled) {
            Button(
                onClick = { OverlayService.start(ctx) },
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Start floating button") }
            Spacer(Modifier.height(8.dp))
        }

        if (canDraw) {
            OutlinedButton(
                onClick = { OverlayService.stop(ctx) },
                modifier = Modifier.fillMaxWidth(),
            ) { Text("Stop floating button") }
            Spacer(Modifier.height(20.dp))
        }

        HorizontalDivider()
        Spacer(Modifier.height(16.dp))
        Text(
            "How it works: start the button, then while on any Instagram/TikTok/Bluesky/Threads profile tap 🔍. " +
                "It reads the username off your screen and shows the verdict — the window floats so you can still see the profile behind it.",
            fontSize = 13.sp,
            color = Color(0xFF94A3B8),
        )
    }
}

@Composable
private fun StatusRow(label: String, ok: Boolean) {
    Row(
        Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(label, color = Color(0xFFE2E8F0), fontSize = 14.sp)
        Text(if (ok) "✅" else "⬜", fontSize = 14.sp)
    }
}
