package com.mattermost.pasteinput

import android.os.Build
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputConnection
import androidx.core.view.inputmethod.EditorInfoCompat
import androidx.core.view.inputmethod.InputConnectionCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.textinput.ReactEditText
import java.lang.Exception


class PasteInputEditText(context: ThemedReactContext) : ReactEditText(context) {
  private lateinit var mOnPasteListener: IPasteInputListener

  fun setOnPasteListener(listener: IPasteInputListener) {
    mOnPasteListener = listener
  }

  fun getOnPasteListener() : IPasteInputListener {
    return mOnPasteListener
  }

  override fun onCreateInputConnection(outAttrs: EditorInfo): InputConnection {
    val ic = super.onCreateInputConnection(outAttrs)

    EditorInfoCompat.setContentMimeTypes(outAttrs, arrayOf<String>("*/*"))

    val callback = InputConnectionCompat.OnCommitContentListener { inputContentInfo, flags, opts ->
      val lacksPermission = (flags and InputConnectionCompat.INPUT_CONTENT_GRANT_READ_URI_PERMISSION) != 0
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1 && lacksPermission) {
        try {
            inputContentInfo.requestPermission()
        } catch (e: Exception) {
          return@OnCommitContentListener false
        }
      }

      getOnPasteListener().onPaste(inputContentInfo.contentUri)

      true
    }

    return InputConnectionCompat.createWrapper(ic, outAttrs, callback)
  }
}
