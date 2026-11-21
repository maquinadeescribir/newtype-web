package com.saw.check

import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.ViewCompositionStrategy

class OverlayService : Service() {

    private lateinit var windowManager: WindowManager
    private var fab: View? = null
    private var panel: View? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        addFab()
    }

    override fun onDestroy() {
        removePanel()
        removeFab()
        super.onDestroy()
    }

    private fun overlayType() =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        else WindowManager.LayoutParams.TYPE_PHONE

    private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()

    private fun addFab() {
        val lp = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            overlayType(),
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT,
        )
        lp.gravity = Gravity.TOP or Gravity.END
        lp.x = dp(12)
        lp.y = dp(200)

        val btn = Button(this)
        btn.text = "\uD83D\uDD0D" // 🔍
        btn.textSize = 20f
        btn.setBackgroundColor(0xFF4F46E5.toInt())
        btn.setTextColor(0xFFFFFFFF.toInt())
        btn.alpha = 0.92f
        btn.setOnClickListener { togglePanel() }

        btn.setOnTouchListener(object : View.OnTouchListener {
            private var startX = 0f
            private var startY = 0f
            private var touchX = 0f
            private var touchY = 0f
            private var dragging = false

            override fun onTouch(v: View, e: MotionEvent): Boolean {
                when (e.action) {
                    MotionEvent.ACTION_DOWN -> {
                        startX = e.rawX; startY = e.rawY; touchX = e.rawX; touchY = e.rawY; dragging = false
                    }
                    MotionEvent.ACTION_MOVE -> {
                        val dx = e.rawX - touchX
                        val dy = e.rawY - touchY
                        if (Math.abs(e.rawX - startX) > 8 || Math.abs(e.rawY - startY) > 8) dragging = true
                        if (dragging) {
                            lp.x = lp.x + dx.toInt()
                            lp.y = lp.y + dy.toInt()
                            windowManager.updateViewLayout(v, lp)
                        }
                        touchX = e.rawX; touchY = e.rawY
                    }
                    MotionEvent.ACTION_UP -> {
                        if (!dragging) v.performClick()
                        return true
                    }
                }
                return false
            }
        })

        fab = btn
        windowManager.addView(btn, lp)
    }

    private fun togglePanel() {
        if (panel != null) { removePanel(); return }
        addPanel()
    }

    private fun addPanel() {
        val dm = resources.displayMetrics
        val width = (dm.widthPixels * 0.88f).toInt().coerceAtMost(dp(420))
        val height = (dm.heightPixels * 0.52f).toInt()

        val lp = WindowManager.LayoutParams(
            width,
            height,
            overlayType(),
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
            PixelFormat.TRANSLUCENT,
        )
        lp.gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
        lp.y = dp(16)

        val composeView = ComposeView(this).apply {
            setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnDetachedFromWindow)
            setContent {
                MaterialTheme(colorScheme = darkColorScheme()) {
                    VetPanel(autoCapture = true, onClose = { removePanel() })
                }
            }
        }

        panel = composeView
        windowManager.addView(composeView, lp)
    }

    private fun removePanel() {
        panel?.let { runCatching { windowManager.removeView(it) } }
        panel = null
    }

    private fun removeFab() {
        fab?.let { runCatching { windowManager.removeView(it) } }
        fab = null
    }

    companion object {
        fun start(ctx: Context) {
            ctx.startService(Intent(ctx, OverlayService::class.java))
        }

        fun stop(ctx: Context) {
            ctx.stopService(Intent(ctx, OverlayService::class.java))
        }
    }
}

object QueueStore {
    private const val PREFS = "saw_check"
    private const val KEY = "queue"

    fun load(ctx: Context): List<String> =
        prefs(ctx).getString(KEY, "")?.split("\n")?.filter { it.isNotBlank() } ?: emptyList()

    fun save(ctx: Context, queue: List<String>) =
        prefs(ctx).edit().putString(KEY, queue.joinToString("\n")).apply()

    private fun prefs(ctx: Context): SharedPreferences =
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
}
