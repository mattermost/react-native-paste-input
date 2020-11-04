package com.mattermost.pasteinput

import android.net.Uri

interface IPasteInputListener {
  fun onPaste(itemUri: Uri)
}
