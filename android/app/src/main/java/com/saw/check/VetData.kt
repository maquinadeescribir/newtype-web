package com.saw.check

import org.json.JSONArray
import java.net.HttpURLConnection
import java.net.URL

data class VetEntry(
    val handle: String,
    val name: String,
    val platform: String,
    val followers: String,
    val focus: String,
    val verdict: String,
    val bucket: String,
    val monetisation: String,
    val notes: String,
    val link: String,
)

object VetDirectory {
    const val DATA_URL = "https://maquinadeescribir.github.io/newtype-web/vetDirectory.json"

    @Volatile
    var entries: List<VetEntry> = emptyList()

    fun fetch(): List<VetEntry> {
        return try {
            val conn = URL(DATA_URL).openConnection() as HttpURLConnection
            conn.connectTimeout = 10000
            conn.readTimeout = 10000
            val text = conn.inputStream.bufferedReader().use { it.readText() }
            parse(text).also { entries = it }
        } catch (e: Exception) {
            entries
        }
    }

    fun parse(json: String): List<VetEntry> {
        val arr = JSONArray(json)
        val out = ArrayList<VetEntry>(arr.length())
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            out.add(
                VetEntry(
                    handle = o.optString("handle"),
                    name = o.optString("name"),
                    platform = o.optString("platform"),
                    followers = o.optString("followers"),
                    focus = o.optString("focus"),
                    verdict = o.optString("verdict"),
                    bucket = o.optString("bucket"),
                    monetisation = o.optString("monetisation"),
                    notes = o.optString("notes"),
                    link = o.optString("link"),
                )
            )
        }
        return out
    }
}

object VetQueueUpload {
    const val UPLOAD_URL = "https://saw-proxy.neurospicyass.workers.dev/vetqueue"

    fun upload(handles: List<String>): Boolean {
        return try {
            val conn = URL(UPLOAD_URL).openConnection() as HttpURLConnection
            conn.connectTimeout = 10000
            conn.readTimeout = 10000
            conn.requestMethod = "POST"
            conn.doOutput = true
            conn.setRequestProperty("Content-Type", "application/json")
            val payload = "{\"handles\":${JSONArray(handles)}}"
            conn.outputStream.use { it.write(payload.toByteArray(Charsets.UTF_8)) }
            conn.responseCode in 200..299
        } catch (e: Exception) {
            false
        }
    }
}
