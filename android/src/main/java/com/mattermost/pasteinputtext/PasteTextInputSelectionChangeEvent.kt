package com.mattermost.pasteinputtext

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

class PasteTextInputSelectionChangeEvent(
    surfaceId: Int,
    viewId: Int,
    private val mSelectionStart: Int,
    private val mSelectionEnd: Int
) : Event<PasteTextInputSelectionChangeEvent>(surfaceId, viewId) {

    override fun getEventName(): String = "onSelectionChange"

    override fun getCoalescingKey(): Short = 0

    override fun getEventData(): WritableMap {
        val eventData = Arguments.createMap()
        eventData.putInt("target", viewTag)
        val selection = Arguments.createMap()
        selection.putInt("start", mSelectionStart)
        selection.putInt("end", mSelectionEnd)
        eventData.putMap("selection", selection)
        return eventData
    }
}
