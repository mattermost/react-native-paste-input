package com.mattermost.pasteinputtext

import android.net.Uri
import com.facebook.react.uimanager.events.EventDispatcher

interface IPasteInputListener {
  fun onPaste(itemUri: Uri, eventDispatcher: EventDispatcher?)
}
