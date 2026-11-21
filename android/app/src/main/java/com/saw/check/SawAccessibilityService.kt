package com.saw.check

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class SawAccessibilityService : AccessibilityService() {

    companion object {
        @Volatile
        var instance: SawAccessibilityService? = null

        fun captureUsername(): String? = instance?.captureFromScreen()
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
        val root = rootInActiveWindow ?: return null
        val counts = HashMap<String, Int>()
        collectHandles(root, counts)
        return counts.maxByOrNull { it.value }?.key
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
