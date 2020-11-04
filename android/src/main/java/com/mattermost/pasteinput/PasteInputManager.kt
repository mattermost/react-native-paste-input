package com.mattermost.pasteinput

import android.os.Build
import android.text.InputType
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.ReactContext
import com.facebook.react.common.MapBuilder

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.textinput.ReactEditText
import com.facebook.react.views.textinput.ReactTextInputManager
import javax.annotation.Nullable

class PasteInputManager(reactContext: ReactContext) : ReactTextInputManager() {
  private val mCallerContext = reactContext
  private var disableCopyPaste: Boolean = false

  companion object {
    const val REACT_CLASS = "PasteInput"
    const val CACHE_DIR_NAME = "mmPasteInput"
  }

  override fun getName(): String {
    return REACT_CLASS
  }

   @RequiresApi(Build.VERSION_CODES.M)
   @ReactProp(name = "disableCopyPaste", defaultBoolean = false)
   fun setDisableCopyPaste(editText: PasteInputEditText, disabled: Boolean) {
     disableCopyPaste = disabled
     editText.customInsertionActionModeCallback = PasteInputActionCallback(editText, disabled)
     editText.customSelectionActionModeCallback = PasteInputActionCallback(editText, disabled)
   }

  @RequiresApi(Build.VERSION_CODES.M)
  override fun createViewInstance(context: ThemedReactContext): ReactEditText {
    val editText = PasteInputEditText(context)
    val inputType = editText.inputType

    editText.inputType = inputType and (InputType.TYPE_TEXT_FLAG_MULTI_LINE.inv())
    editText.returnKeyType = "done";
    editText.customInsertionActionModeCallback = PasteInputActionCallback(editText, disableCopyPaste)
    editText.customSelectionActionModeCallback = PasteInputActionCallback(editText, disableCopyPaste)

    return editText
  }

   override fun addEventEmitters(reactContext: ThemedReactContext, editText: ReactEditText) {
     super.addEventEmitters(reactContext, editText)

     val pasteInputEditText = editText as PasteInputEditText
     pasteInputEditText.setOnPasteListener(PasteInputListener(pasteInputEditText))
   }

   @Nullable
   override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any> {
     val map = super.getExportedCustomBubblingEventTypeConstants()!!
     map.put(
       "onPaste",
       MapBuilder.of(
         "phasedRegistrationNames",
         MapBuilder.of("bubbled", "onPaste")
       )
     )

     return map
   }
}
