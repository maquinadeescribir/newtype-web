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

class OverlayService : Service() {

    private lateinit var windowManager: WindowManager
    private var overlay: View? = null
    private var params: WindowManager.LayoutParams? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        addOverlay()
    }

    override fun onDestroy() {
        removeOverlay()
        super.onDestroy()
    }

    private fun addOverlay() {
        val type =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else WindowManager.LayoutParams.TYPE_PHONE

        val lp = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT,
        )
        lp.gravity = Gravity.TOP or Gravity.END
        lp.x = 16
        lp.y = 220

        val btn = Button(this)
        btn.text = "\uD83D\uDD0D" // 🔍
        btn.textSize = 20f
        btn.setBackgroundColor(0xFF4F46E5.toInt())
        btn.setTextColor(0xFFFFFFFF.toInt())
        btn.alpha = 0.92f
        btn.setOnClickListener {
            val i = Intent(this, MainActivity::class.java)
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(i)
        }

        // simple drag-to-move
        btn.setOnTouchListener(object : View.OnTouchListener {
            private var startX = 0f
            private var startY = 0f
            private var touchX = 0f
            private var touchY = 0f
            private var dragging = false

            override fun onTouch(v: View, e: MotionEvent): Boolean {
                when (e.action) {
                    MotionEvent.ACTION_DOWN -> {
                        startX = e.rawX
                        startY = e.rawY
                        touchX = e.rawX
                        touchY = e.rawY
                        dragging = false
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
                        touchX = e.rawX
                        touchY = e.rawY
                    }
                    MotionEvent.ACTION_UP -> {
                        if (!dragging) v.performClick()
                        return true
                    }
                }
                return false
            }
        })

        overlay = btn
        params = lp
        windowManager.addView(btn, lp)
    }

    private fun removeOverlay() {
        overlay?.let { runCatching { windowManager.removeView(it) } }
        overlay = null
    }

    companion object {
        fun start(ctx: Context) {
            ctx.startService(Intent(ctx, OverlayService::class.java))
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
