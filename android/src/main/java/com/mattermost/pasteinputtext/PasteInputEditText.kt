package com.mattermost.pasteinputtext

import android.annotation.SuppressLint
import androidx.core.view.ContentInfoCompat
import androidx.core.view.OnReceiveContentListener
import androidx.core.view.ViewCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.textinput.ReactEditText


@SuppressLint("ViewConstructor")
class PasteInputEditText(context: ThemedReactContext) : ReactEditText(context) {
  private lateinit var mOnPasteListener: IPasteInputListener
  private lateinit var mPasteEventDispatcher: EventDispatcher
  private var mDisabledCopyPaste: Boolean = false

  /**
   * Every way content reaches the input arrives here: a keyboard's image insert, long-press →
   * Paste, and drag-and-drop (natively on API 31+, through AppCompat below). Items with a URI are
   * files and go to the paste listener; text is handed back for the default handling.
   */
  private val receiveContentListener = OnReceiveContentListener { _, payload ->
    if (mDisabledCopyPaste || !::mOnPasteListener.isInitialized) return@OnReceiveContentListener payload
    val split = payload.partition { item -> item.uri != null }
    val files: ContentInfoCompat? = split.first
    if (files != null) {
      val clip = files.clip
      val dispatcher = if (::mPasteEventDispatcher.isInitialized) mPasteEventDispatcher else null
      for (i in 0 until clip.itemCount) {
        clip.getItemAt(i).uri?.let { mOnPasteListener.onPaste(it, dispatcher) }
      }
    }
    split.second
  }

  init {
    ViewCompat.setOnReceiveContentListener(this, arrayOf("image/*", "video/*", "audio/*", "application/*"), receiveContentListener)
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
}
