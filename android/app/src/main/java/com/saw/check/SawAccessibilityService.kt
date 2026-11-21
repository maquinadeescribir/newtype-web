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

    private data class Candidate(val handle: String, val top: Int, val size: Float, val at: Boolean)

    private val STOPWORDS = setOf(
        "the", "and", "for", "you", "your", "are", "not", "this", "that", "with", "from",
        "have", "has", "was", "were", "will", "would", "about", "just", "like", "love",
        "new", "video", "videos", "sound", "follow", "following", "followers", "likes",
        "share", "comment", "comments", "suggested", "more", "home", "now", "today",
        "profile", "edit", "message", "messages", "foryou", "fyp", "live", "shop", "post",
        "posts", "reply", "replies", "see", "all", "view", "views", "learn", "high",
        "performer", "engineer", "diagnosed", "creator", "theory", "domino", "take",
        "free", "quiz", "link", "bio", "adhd", "late", "gut", "brain", "coach"
    )

    fun captureFromScreen(): String? {
        val root = findAppRoot() ?: return null
        val candidates = ArrayList<Candidate>()
        collectCandidates(root, candidates)
        if (candidates.isEmpty()) return null
        // Prefer the LARGEST text (the profile header username), then the highest
        // position, then @-prefixed.
        val best = candidates.maxWithOrNull(
            compareBy<Candidate> { it.size }
                .thenBy { -it.top.toLong() }
                .thenBy { if (it.at) 1 else 0 }
        )
        return best?.handle
    }

    private fun findAppRoot(): AccessibilityNodeInfo? {
        // Prefer the ACTIVE window (the true foreground app) unless it's our own overlay.
        val active = rootInActiveWindow
        if (active != null && active.packageName?.toString() != packageName) {
            return active
        }
        // Overlay is focused (or no active window) — find the app window behind it.
        for (w in windows) {
            val root = w.root ?: continue
            val pkg = root.packageName?.toString()
            if (pkg != null && pkg != packageName) {
                return root
            }
        }
        return active
    }

    private fun collectCandidates(node: AccessibilityNodeInfo, out: ArrayList<Candidate>) {
        val bounds = Rect()
        node.getBoundsInScreen(bounds)
        val top = bounds.top
        val size = if (node.textSize > 0f) node.textSize else 0f
        node.text?.toString()?.let { text ->
            Regex("@([a-zA-Z0-9._]{2,30})").findAll(text).forEach { m ->
                out.add(Candidate(m.groupValues[1], top, size, true))
            }
            Regex("\\b([a-z][a-z0-9._]{2,29})\\b").findAll(text).forEach { m ->
                val t = m.groupValues[1]
                if (t !in STOPWORDS && (t.length >= 6 || t.any { it.isDigit() || it == '_' || it == '.' })) {
                    out.add(Candidate(t, top, size, false))
                }
            }
        }
        for (i in 0 until node.childCount) {
            node.getChild(i)?.let { collectCandidates(it, out) }
        }
    }
}
