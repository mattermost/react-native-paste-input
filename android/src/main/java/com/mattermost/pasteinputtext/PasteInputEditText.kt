package com.mattermost.pasteinputtext

import android.annotation.SuppressLint
import android.os.Build
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputConnection
import androidx.core.view.inputmethod.EditorInfoCompat
import androidx.core.view.inputmethod.InputConnectionCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.textinput.ReactEditText
import java.lang.Exception


@SuppressLint("ViewConstructor")
class PasteInputEditText(context: ThemedReactContext) : ReactEditText(context) {
  private lateinit var mOnPasteListener: IPasteInputListener
  private lateinit var mPasteEventDispatcher: EventDispatcher
  private var mDisabledCopyPaste: Boolean = false
  private var mSelectionWatcher: SelectionWatcher? = null

  interface SelectionWatcher {
    fun onSelectionChanged(selStart: Int, selEnd: Int)
  }

  fun setSelectionWatcher(selectionWatcher: SelectionWatcher?) {
      mSelectionWatcher = selectionWatcher
  }

  override fun onSelectionChanged(selStart: Int, selEnd: Int) {
      super.onSelectionChanged(selStart, selEnd)
      mSelectionWatcher?.onSelectionChanged(selStart, selEnd)
  }

  fun setDisableCopyPaste(disabled: Boolean) {
    this.mDisabledCopyPaste = disabled
  }

  fun setOnPasteListener(listener: IPasteInputListener, event: EventDispatcher?) {
    mOnPasteListener = listener
    if (event != null) {
      mPasteEventDispatcher = event
    }
  }

  fun getOnPasteListener() : IPasteInputListener {
    return mOnPasteListener
  }

  override fun onCreateInputConnection(outAttrs: EditorInfo): InputConnection {
    val ic = super.onCreateInputConnection(outAttrs)

    EditorInfoCompat.setContentMimeTypes(outAttrs, arrayOf("*/*"))

    val callback = InputConnectionCompat.OnCommitContentListener { inputContentInfo, flags, _ ->
      val lacksPermission = (flags and InputConnectionCompat.INPUT_CONTENT_GRANT_READ_URI_PERMISSION) != 0
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N_MR1 && lacksPermission) {
        try {
            inputContentInfo.requestPermission()
        } catch (e: Exception) {
          return@OnCommitContentListener false
        }
      }

      if (!mDisabledCopyPaste) {
        getOnPasteListener().onPaste(inputContentInfo.contentUri, mPasteEventDispatcher)
      }

      true
    }

    return InputConnectionCompat.createWrapper(ic!!, outAttrs, callback)
  }
}
