package com.mattermost.pasteinputtext

import android.view.ActionMode
import android.view.Menu
import android.view.MenuItem
import com.facebook.react.uimanager.events.EventDispatcher

class PasteInputActionCallback(editText: PasteInputEditText, disabled: Boolean, eventDispatcher: EventDispatcher?) : ActionMode.Callback {
  private val isDisabled = disabled
  private val mEditText = editText
  private val mEventDispatcher = eventDispatcher


  override fun onCreateActionMode(mode: ActionMode?, menu: Menu?): Boolean {
    if (isDisabled) {
      disableMenus(menu)
    }

    return true
  }

  override fun onPrepareActionMode(mode: ActionMode?, menu: Menu?): Boolean {
    return false
  }

  override fun onActionItemClicked(mode: ActionMode?, item: MenuItem?): Boolean {
    // Paste goes through the view's OnReceiveContentListener, which splits files from text.
    mEditText.onTextContextMenuItem(item!!.itemId)
    if (item.itemId == android.R.id.paste) mode?.finish()
    return true
  }

  override fun onDestroyActionMode(mode: ActionMode?) {

  }

  private fun disableMenus(menu: Menu?) {
    if (menu != null) {
      for (i in 0 until menu.size()) {
        val item = menu.getItem(i)
        val id = item.itemId
        val shouldDisableMenu = (
          id == android.R.id.paste ||
            id == android.R.id.copy ||
            id == android.R.id.cut
          )
        item.isEnabled = !shouldDisableMenu
      }
    }
  }
}
