package com.mattermost.pasteinputtext

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class PasteTextInputPackage : ReactPackage {
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
    listOf(PasteTextInputManager(reactContext))

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
    emptyList()
}
