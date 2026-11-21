package com.saw.check

import android.accessibilityservice.AccessibilityService
import android.graphics.Rect
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

    private data class Candidate(val handle: String, val top: Int, val at: Boolean)

    private val STOPWORDS = setOf(
        "the", "and", "for", "you", "your", "are", "not", "this", "that", "with", "from",
        "have", "has", "was", "were", "will", "would", "about", "just", "like", "love",
        "new", "video", "videos", "sound", "follow", "following", "followers", "likes",
        "share", "comment", "comments", "suggested", "more", "home", "now", "today",
        "profile", "edit", "message", "messages", "foryou", "fyp", "live", "shop", "post",
        "posts", "reply", "replies", "see", "all", "view", "views"
    )

    fun captureFromScreen(): String? {
        val root = findAppRoot() ?: return null
        val candidates = ArrayList<Candidate>()
        collectCandidates(root, candidates)
        if (candidates.isEmpty()) return null
        // The profile/video-creator handle sits at the TOP of the screen.
        // Pick the top-most candidate; @-prefixed breaks ties.
        val best = candidates.minWithOrNull(
            compareBy<Candidate> { it.top }.thenBy { if (it.at) 0 else 1 }
        )
        return best?.handle
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

    private fun collectCandidates(node: AccessibilityNodeInfo, out: ArrayList<Candidate>) {
        val bounds = Rect()
        node.getBoundsInScreen(bounds)
        val top = bounds.top
        node.text?.toString()?.let { text ->
            Regex("@([\\w._]{2,30})").findAll(text).forEach { m ->
                out.add(Candidate(m.groupValues[1], top, true))
            }
            val t = text.trim()
            if (t.length in 3..30 && t.none { it.isWhitespace() } &&
                t.firstOrNull()?.isLowerCase() == true &&
                t.all { it.isLowerCase() || it.isDigit() || it == '.' || it == '_' } &&
                t !in STOPWORDS
            ) {
                out.add(Candidate(t, top, false))
            }
        }
        for (i in 0 until node.childCount) {
            node.getChild(i)?.let { collectCandidates(it, out) }
        }
    }
}
