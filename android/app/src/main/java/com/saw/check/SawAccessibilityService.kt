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

        fun captureDebug(): String {
            val s = instance ?: return "service=NOT_CONNECTED"
            return s.debugCapture()
        }

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
        "posts", "reply", "replies", "see", "all", "view", "views", "learn", "high",
        "performer", "engineer", "diagnosed", "creator", "theory", "domino", "take",
        "free", "quiz", "link", "bio", "adhd", "late", "gut", "brain", "coach"
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

    fun debugCapture(): String {
        return try {
            val activePkg = rootInActiveWindow?.packageName?.toString() ?: "null"
            val winPkgs = windows.mapNotNull { runCatching { it.root?.packageName?.toString() }.getOrNull() }
            val root = findAppRoot()
            val rootPkg = root?.packageName?.toString() ?: "null"
            val cands = if (root != null) {
                val c = ArrayList<Candidate>()
                collectCandidates(root, c)
                c.size
            } else -1
            "active=$activePkg wins=$winPkgs root=$rootPkg cands=$cands"
        } catch (e: Exception) {
            "debug-error: ${e.message}"
        }
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
        node.text?.toString()?.let { text ->
            Regex("@([a-zA-Z0-9._]{2,30})").findAll(text).forEach { m ->
                out.add(Candidate(m.groupValues[1], top, true))
            }
            Regex("\\b([a-z][a-z0-9._]{2,29})\\b").findAll(text).forEach { m ->
                val t = m.groupValues[1]
                if (t !in STOPWORDS && (t.length >= 6 || t.any { it.isDigit() || it == '_' || it == '.' })) {
                    out.add(Candidate(t, top, false))
                }
            }
        }
        for (i in 0 until node.childCount) {
            node.getChild(i)?.let { collectCandidates(it, out) }
        }
    }
}
