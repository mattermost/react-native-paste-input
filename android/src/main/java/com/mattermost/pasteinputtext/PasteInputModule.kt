package com.mattermost.pasteinputtext

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

/**
 * TurboModule stub for Android
 *
 * On Android, we use the ViewManager approach (PasteTextInputManager) for the actual
 * paste interception since we cannot do runtime method swizzling like iOS.
 *
 * This module exists only to satisfy codegen requirements and maintain API consistency
 * across platforms. The actual paste handling is done by PasteInputEditText and
 * PasteTextInputManager.
 */
@ReactModule(name = PasteInputModule.NAME)
class PasteInputModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "PasteInputModule"
        const val TAG = "[PasteInput]"
    }

    override fun getName(): String = NAME

    /**
     * No-op on Android - registration handled by ViewManager
     */
    @ReactMethod
    fun registerTextInput(nativeID: String, config: ReadableMap) {
        Log.d(TAG, "registerTextInput called on Android (no-op, handled by ViewManager)")
    }

    /**
     * No-op on Android - registration handled by ViewManager
     */
    @ReactMethod
    fun unregisterTextInput(nativeID: String) {
        Log.d(TAG, "unregisterTextInput called on Android (no-op, handled by ViewManager)")
    }

    /**
     * Required for EventEmitter
     */
    @ReactMethod
    fun addListener(eventName: String) {
        // Required for RCTEventEmitter interface - no-op on Android
    }

    /**
     * Required for EventEmitter
     */
    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for RCTEventEmitter interface - no-op on Android
    }
}
