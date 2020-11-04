package com.mattermost.pasteinput

import android.content.ClipboardManager
import android.content.Context
import android.net.Uri
import android.os.Build
import android.util.Patterns
import android.webkit.MimeTypeMap
import android.webkit.URLUtil
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.RCTEventEmitter
import java.io.FileNotFoundException

class PasteInputListener(editText: PasteInputEditText) : IPasteInputListener {
  val mEditText = editText

  @RequiresApi(Build.VERSION_CODES.KITKAT)
  override fun onPaste(itemUri: Uri) {
    val reactContext = mEditText.context as ReactContext
    val uriMimeType = reactContext.contentResolver.getType(itemUri) ?: return

    var uriString: String = itemUri.toString()
    var extension: String
    var mimeType: String
    var fileName: String
    var fileSize: Long
    var files: WritableArray? = null
    var error: WritableMap? = null

    // Special handle for Google docs
    if (uriString.equals("content://com.google.android.apps.docs.editors.kix.editors.clipboard")) {
      val clipboardManager = reactContext.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
      val clipData = clipboardManager.primaryClip ?: return
      val item = clipData.getItemAt(0) ?: return
      val htmlText = item.htmlText

      // Find uri from html
      val matcher = Patterns.WEB_URL.matcher(htmlText)
      if (matcher.find()) {
        uriString = htmlText.substring(matcher.start(1), matcher.end())
      }
    } else if (uriString.startsWith("http")) {
      val pastImageFromUrlThread = Thread(PasteInputFileFromUrl(reactContext, mEditText, uriString))
      pastImageFromUrlThread.start()
      return
    }

    uriString = RealPathUtil.getRealPathFromURI(reactContext, itemUri) ?: return
    extension = MimeTypeMap.getFileExtensionFromUrl(uriString) ?: return
    mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension) ?: return
    fileName = URLUtil.guessFileName(uriString, null, mimeType)

    try {
      val contentResolver = reactContext.contentResolver
      val assetFileDescriptor = contentResolver.openAssetFileDescriptor(itemUri, "r") ?: return
      val file = Arguments.createMap()

      files = Arguments.createArray()
      fileSize = assetFileDescriptor.length
      file.putString("type", mimeType)
      file.putDouble("fileSize", fileSize.toDouble())
      file.putString("fileName", fileName)
      file.putString("uri", "file://$uriString")

      files.pushMap(file)
    } catch (e: FileNotFoundException) {
      error = Arguments.createMap()
      error.putString("message", e.localizedMessage)
    }

    val event = Arguments.createMap()
    event.putArray("data", files)
    event.putMap("error", error)

    reactContext.getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(mEditText.id, "onPaste", event)
  }
}
