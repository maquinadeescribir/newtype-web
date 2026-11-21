package com.saw.check

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.provider.Settings
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class SawAccessibilityService : AccessibilityService() {

    companion object {
        @Volatile
        var instance: SawAccessibilityService? = null

        fun captureUsername(): String? = instance?.captureFromScreen()

        fun isEnabled(ctx: Context): Boolean {
            val services = Settings.Secure.getString(
                ctx.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
            ) ?: return false
            return services.split(':').any { it.contains(ctx.packageName) }
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}

    override fun onInterrupt() {}

    override fun onDestroy() {
        if (instance === this) instance = null
        super.onDestroy()
    }

    fun captureFromScreen(): String? {
        val root = findAppRoot() ?: return null
        val counts = HashMap<String, Int>()
        collectHandles(root, counts)
        return counts.maxByOrNull { it.value }?.key
    }

    private fun findAppRoot(): AccessibilityNodeInfo? {
        // Pick the app window BEHIND our overlay (skip our own floating panel/FAB),
        // so the panel being open doesn't shadow the app we're trying to read.
        for (w in windows) {
            val root = w.root ?: continue
            val pkg = root.packageName?.toString()
            if (pkg != null && pkg != packageName) {
                return root
            }
        }
        return rootInActiveWindow
    }

    private fun collectHandles(node: AccessibilityNodeInfo, counts: HashMap<String, Int>) {
        node.text?.toString()?.let { text ->
            Regex("@[\\w._]+").findAll(text).forEach { m ->
                val h = m.value
                counts[h] = (counts[h] ?: 0) + 1
            }
        }
        for (i in 0 until node.childCount) {
            node.getChild(i)?.let { collectHandles(it, counts) }
        }
    }
}
