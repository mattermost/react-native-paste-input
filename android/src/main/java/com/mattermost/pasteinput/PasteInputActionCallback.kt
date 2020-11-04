package com.mattermost.pasteinput

import android.content.ClipboardManager
import android.content.Context
import android.net.Uri
import android.view.ActionMode
import android.view.Menu
import android.view.MenuItem

class PasteInputActionCallback(editText: PasteInputEditText, disabled: Boolean) : ActionMode.Callback {
  val isDisabled = disabled
  val mEditText = editText

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
    val uri = getUriInClipboard()
    if (item?.itemId == android.R.id.paste && uri != null) {
      mEditText.getOnPasteListener().onPaste(uri)
      mode?.finish()
    } else {
      mEditText.onTextContextMenuItem(item!!.itemId)
    }

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

  private fun getUriInClipboard() : Uri? {
    val clipboardManager = mEditText.context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    val clipData = clipboardManager.primaryClip

    if (clipData == null) {
      return null
    }

    val item = clipData.getItemAt(0)
    if (item == null) {
      return null
    }

    val chars = item.text
    if (chars == null) {
      return null
    }

    val text = chars.toString()
    if (text.length > 0) {
      return null
    }

    return item.uri
  }
}
