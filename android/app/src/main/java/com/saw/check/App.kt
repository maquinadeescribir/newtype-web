package com.saw.check

import android.app.Application
import android.content.Context
import java.io.PrintWriter
import java.io.StringWriter

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        val default = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
            try {
                val sw = StringWriter()
                throwable.printStackTrace(PrintWriter(sw))
                val version = try {
                    packageManager.getPackageInfo(packageName, 0).versionName ?: "?"
                } catch (_: Exception) {
                    "?"
                }
                val ts = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm", java.util.Locale.US)
                    .format(java.util.Date())
                openFileOutput(CRASH_FILE, MODE_PRIVATE).use {
                    it.write(("Saw Check v$version · $ts\n\n" + sw).toByteArray())
                }
            } catch (_: Exception) {
            }
            default?.uncaughtException(thread, throwable)
        }
    }

    companion object {
        const val CRASH_FILE = "crash.log"

        fun readCrash(ctx: Context): String? = try {
            ctx.openFileInput(CRASH_FILE).bufferedReader().use { it.readText() }.takeIf { it.isNotBlank() }
        } catch (_: Exception) {
            null
        }

        fun clearCrash(ctx: Context) = try { ctx.deleteFile(CRASH_FILE) } catch (_: Exception) {}
    }
}
