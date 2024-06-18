package com.mattermost.pasteinputtext;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class PasteTextInputPasteEvent extends Event<PasteTextInputPasteEvent> {
  private static final String EVENT_NAME = "onPaste";
  private final ReadableMap mEventData;

  @Deprecated
  public PasteTextInputPasteEvent(int viewId) {
    this(-1, viewId, null);
  }

  public PasteTextInputPasteEvent(int surfaceId, int viewId, ReadableMap eventData) {
    super(surfaceId, viewId);
    mEventData = eventData;
  }

  public boolean canCoalesce() {
    return false;
  }

  @NonNull
  public String getEventName() {
    return EVENT_NAME;
  }

  @Nullable
  protected WritableMap getEventData() {
    WritableMap eventData = Arguments.createMap();
    eventData.putInt("target", this.getViewTag());
    eventData.merge(mEventData);
    return eventData;
  }
}
