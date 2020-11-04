package com.mattermost.pasteinput

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.views.textinput.ReactEditText
import java.io.IOException
import java.net.URL

class PasteInputFileFromUrl(context: ReactContext, target: ReactEditText, uri: String): Runnable {
  private val mContext = context
  private val mTarget = target
  private val mUri = uri

  override fun run() {
    var files: WritableArray? = null
    var error: WritableMap? = null

    try {
      val url = URL(mUri)
      val conn = url.openConnection()
      val mimeType = conn.getHeaderField("Content-Type")
      val fileSize = java.lang.Long.parseLong(conn.getHeaderField("Content-Length"))
      val contentDisposition = conn.getHeaderField("Content-Disposition")
      val startIndex = contentDisposition.indexOf("filename=\"") + 10
      val endIndex = contentDisposition.length - 1
      val fileName = contentDisposition.substring(startIndex, endIndex)
      val file = Arguments.createMap()

      file.putString("type", mimeType)
      file.putDouble("fileSize", fileSize.toDouble())
      file.putString("fileName", fileName)
      file.putString("uri", mUri)

      files = Arguments.createArray()
      files.pushMap(file)
    } catch (e: IOException) {
      error = Arguments.createMap()
      error.putString("message", e.localizedMessage)
    }

    val event = Arguments.createMap()
    event.putArray("data", files)
    event.putMap("error", error)

    mContext.getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(mTarget.id, "onPaste", event)
  }
}
