package com.mattermost.pasteinput

import android.content.Context
import android.database.Cursor
import android.net.Uri
import android.os.Build
import android.provider.DocumentsContract
import android.provider.MediaStore
import android.provider.OpenableColumns
import android.os.Environment
import android.webkit.MimeTypeMap
import android.util.Log
import android.text.TextUtils
import androidx.annotation.RequiresApi
import java.io.*

object RealPathUtil {
  init {
      deleteTempFiles(File(PasteInputManager.CACHE_DIR_NAME))
  }

  @RequiresApi(Build.VERSION_CODES.KITKAT)
  fun getRealPathFromURI(context:Context, uri:Uri): String? {
    val isKitKatOrNewer = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT
    // DocumentProvider
    if (isKitKatOrNewer && DocumentsContract.isDocumentUri(context, uri))
    {
      // ExternalStorageProvider
      if (isExternalStorageDocument(uri))
      {
        val docId = DocumentsContract.getDocumentId(uri)
        val split = docId.split((":").toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()
        val type = split[0]
        if ("primary".equals(type, ignoreCase = true))
        {
          return context.getExternalFilesDir(split[1])?.absolutePath
        }
      }
      else if (isDownloadsDocument(uri))
      {
        // DownloadsProvider
        val id = DocumentsContract.getDocumentId(uri)
        if (!TextUtils.isEmpty(id))
        {
          if (id.startsWith("raw:"))
          {
            return id.replaceFirst(("raw:").toRegex(), "")
          }
          try
          {
            return getPathFromSavingTempFile(context, uri)
          }
          catch (e:NumberFormatException) {
            Log.e("ReactNative", "DownloadsProvider unexpected uri $uri")
            return null
          }
        }
      }
      else if (isMediaDocument(uri))
      {
        // MediaProvider
        val docId = DocumentsContract.getDocumentId(uri)
        val split = docId.split((":").toRegex()).dropLastWhile { it.isEmpty() }.toTypedArray()
        val type = split[0]
        var contentUri: Uri? = null
        if ("image" == type)
        {
          contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI
        }
        else if ("video" == type)
        {
          contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI
        }
        else if ("audio" == type)
        {
          contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
        }
        val selection = "_id=?"
        val selectionArgs = arrayOf<String>(split[1])
        return contentUri?.let { getDataColumn(context, it, selection, selectionArgs) }
      }
    }
    if ("content".equals(uri.scheme, ignoreCase = true))
    {
      // MediaStore (and general)
      if (isGooglePhotosUri(uri))
      {
        return uri.lastPathSegment
      }
      // Try save to tmp file, and return tmp file path
      return getPathFromSavingTempFile(context, uri)
    }
    else if ("file".equals(uri.scheme, ignoreCase = true))
    {
      return uri.path
    }
    return null
  }

  private fun getPathFromSavingTempFile(context:Context, uri:Uri): String? {
    val tmpFile:File
    var fileName: String? = null
    // Try and get the filename from the Uri
    try
    {
      val returnCursor = context.contentResolver.query(uri, null, null, null, null)
      val nameIndex = returnCursor?.getColumnIndex(OpenableColumns.DISPLAY_NAME)
      returnCursor?.moveToFirst()
      fileName = nameIndex?.let { returnCursor?.getString(it) }
    }
    catch (e:Exception) {
      // just continue to get the filename with the last segment of the path
    }
    try
    {
      if (fileName == null)
      {
        fileName = uri.lastPathSegment.toString().trim()
      }
      val cacheDir = File(context.cacheDir, PasteInputManager.CACHE_DIR_NAME)
      if (!cacheDir.exists())
      {
        cacheDir.mkdirs()
      }
      val mimeType = uri.path?.let { getMimeType(it) }
      tmpFile = File(cacheDir, fileName)
      tmpFile.createNewFile()
      val pfd = context.contentResolver.openFileDescriptor(uri, "r")
      val src = FileInputStream(pfd?.fileDescriptor).channel
      val dst = FileOutputStream(tmpFile).channel
      dst.transferFrom(src, 0, src.size())
      src.close()
      dst.close()
    }
    catch (ex:IOException) {
      return null
    }
    return tmpFile.absolutePath
  }

  private fun getDataColumn(context:Context, uri:Uri, selection:String,
                            selectionArgs:Array<String>): String? {
    var cursor: Cursor? = null
    val column = "_data"
    val projection = arrayOf<String>(column)
    try
    {
      cursor = context.contentResolver.query(uri, projection, selection, selectionArgs, null)
      if (cursor != null && cursor.moveToFirst())
      {
        val index = cursor.getColumnIndexOrThrow(column)
        return cursor.getString(index)
      }
    }
    finally
    {
      cursor?.close()
    }

    return null
  }

  private fun isExternalStorageDocument(uri:Uri):Boolean {
    return "com.android.externalstorage.documents" == uri.getAuthority()
  }

  private fun isDownloadsDocument(uri:Uri):Boolean {
    return "com.android.providers.downloads.documents" == uri.getAuthority()
  }

  private fun isMediaDocument(uri:Uri):Boolean {
    return "com.android.providers.media.documents" == uri.getAuthority()
  }

  private fun isGooglePhotosUri(uri:Uri):Boolean {
    return "com.google.android.apps.photos.content" == uri.getAuthority()
  }

  private fun getExtension(uri: String?): String? {
    if (uri == null)
    {
      return null
    }

    val dot = uri.lastIndexOf(".")
    if (dot >= 0)
    {
      return uri.substring(dot)
    } else {
      // No extension.
      return ""
    }
  }

  private fun getMimeType(file: File): String? {
    val extension = getExtension(file.getName())
    if (extension?.length!! > 0) {
      return MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension.substring(1))
    }

    return "application/octet-stream"
  }

  private fun getMimeType(filePath: String): String? {
    val file = File(filePath)
    return getMimeType(file)
  }

  private fun deleteTempFiles(dir:File) {
    try
    {
      if (dir.isDirectory)
      {
        deleteRecursive(dir)
      }
    }
    catch (e:Exception) {
      // do nothing
    }
  }

  private fun deleteRecursive(fileOrDirectory:File) {
    if (fileOrDirectory.isDirectory)
      for (child in fileOrDirectory.listFiles())
        deleteRecursive(child)
    fileOrDirectory.delete()
  }
}
