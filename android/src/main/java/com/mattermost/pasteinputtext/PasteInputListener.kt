package com.mattermost.pasteinputtext

import android.content.ClipboardManager
import android.content.Context
import android.net.Uri
import android.util.Patterns
import android.webkit.MimeTypeMap
import android.webkit.URLUtil
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.EventDispatcher
import java.io.FileNotFoundException

class PasteInputListener(editText: PasteInputEditText, surfaceId: Int) : IPasteInputListener {
  private val mEditText = editText
  private val mSurfaceId = surfaceId

  override fun onPaste(itemUri: Uri, eventDispatcher: EventDispatcher?) {
    // A provider can refuse (a stale clipboard grant raises SecurityException): that is an error
    // event for the app to show, never a crash.
    try {
      handlePaste(itemUri, eventDispatcher)
    } catch (e: Exception) {
      dispatchError(eventDispatcher, e.localizedMessage ?: "The pasted item could not be read.")
    }
  }

  private fun handlePaste(itemUri: Uri, eventDispatcher: EventDispatcher?) {
    val reactContext = mEditText.context as ReactContext
    val resolvedType = reactContext.contentResolver.getType(itemUri)

    var uriString: String = itemUri.toString()
    val mimeType: String
    val fileSize: Long
    var files: WritableArray? = null
    var error: WritableMap? = null

    // Special handle for Google docs
    if (uriString == "content://com.google.android.apps.docs.editors.kix.editors.clipboard") {
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
      val pastImageFromUrlThread = Thread(PasteInputFileFromUrl(
        mEditText,
        uriString,
        mSurfaceId,
        eventDispatcher
      ))
      pastImageFromUrlThread.start()
      return
    } else {
      uriString = RealPathUtil.getRealPathFromURI(reactContext, itemUri)
        ?: return dispatchError(eventDispatcher, "The pasted item could not be read.")
    }

    // The provider knows what it holds; the extension is only a fallback (many providers name
    // files without one).
    val extension: String? = MimeTypeMap.getFileExtensionFromUrl(uriString)
    mimeType = resolvedType?.takeIf { it != "application/octet-stream" }
      ?: extension?.let { MimeTypeMap.getSingleton().getMimeTypeFromExtension(it) }
      ?: resolvedType
      ?: return dispatchError(eventDispatcher, "The pasted item has no type.")
    val fileName: String = URLUtil.guessFileName(uriString, null, mimeType)

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
      assetFileDescriptor.close()
    } catch (e: FileNotFoundException) {
      error = Arguments.createMap()
      error.putString("message", e.localizedMessage)
    }

    val event = Arguments.createMap()
    event.putArray("data", files)
    event.putMap("error", error)

    eventDispatcher?.dispatchEvent(PasteTextInputPasteEvent(mSurfaceId, mEditText.id, event))
  }

  private fun dispatchError(eventDispatcher: EventDispatcher?, message: String) {
    val error = Arguments.createMap()
    error.putString("message", message)
    val event = Arguments.createMap()
    event.putArray("data", null)
    event.putMap("error", error)
    eventDispatcher?.dispatchEvent(PasteTextInputPasteEvent(mSurfaceId, mEditText.id, event))
  }
}
