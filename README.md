# @mattermost/react-native-paste-input

React Native `TextInput` component has functionality to capture text input from a user
by using the soft and hardware keyboards but lacks the ability to restrict copy & paste options
as well as allowing pasting different file formats copied from other apps, like images & videos from
the Photos gallery app.

`PasteInput` is a `TextInput` replacement that solves these issues.

## Requirements

- **React Native >= 0.76.0** (Fabric/New Architecture only)
- **iOS >= 13.4**
- **Android minSdkVersion >= 21**

## Installation

```sh
npm install --save-exact @mattermost/react-native-paste-input
```

### iOS Setup (Required)

For iOS bridgeless mode support (React Native 0.74+), you need to configure the `reactHost` in your `AppDelegate`:

```objc
// AppDelegate.mm
#import <React/RCTAppDelegate.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <react-native-paste-input/PasteInputModule.h>
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"YourAppName";
  BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];

#ifdef RCT_NEW_ARCH_ENABLED
  // Set the reactHost for PasteInputModule (required for bridgeless mode)
  if (self.rootViewFactory.reactHost) {
    [PasteInputModule setReactHost:self.rootViewFactory.reactHost];
  }
#endif

  return result;
}

@end
```

**Note:** This is required for bridgeless mode. Bridge mode (Fabric with bridge enabled) will work without this setup, but bridgeless mode is the recommended and default mode in React Native 0.74+.

### Android Setup

No additional setup required - autolinking will handle everything.

## Demo
| Android | iOS |
|---------|-----|
|![Android](/example/gifs/AndroidPasteInput.gif)|![iOS](/example/gifs/iOSPasteInput.gif)|

## Usage

```js
import React, { useRef } from 'react';
import PasteInput, { PastedFile, PasteInputRef } from "@mattermost/react-native-paste-input";

const YourTextInput = () => {
    const inputRef = useRef<PasteInputRef>(null);

    const onPaste = (
        error: string | null | undefined,
        files: Array<PastedFile>
    ) => {
        if (error) {
            console.error('Paste error:', error);
            return;
        }

        console.log('PASTED FILES', files);
        // files is an array of { fileName, fileSize, type, uri }
    };

    return (
        <PasteInput
            ref={inputRef}
            disableCopyPaste={false}
            onPaste={onPaste}
            multiline={true}
            blurOnSubmit={false}
            underlineColorAndroid="transparent"
            keyboardType="default"
            disableFullscreenUI={true}
            textContentType="none"
            autoComplete="off"
        />
    );
}
```

## API

### Properties

All properties of the [TextInput](https://reactnative.dev/docs/textinput) component plus:

#### `disableCopyPaste: boolean`
Indicates if the menu items for *cut*, *copy*, *paste* and *share* should not be present in the context menu.

**Default:** `false`

#### `onPaste: (error: string | null, files: PastedFile[]) => void`
Callback that is called when pasting files into the text input.

**Note:** On Android, this callback is also called when selecting an image/GIF from the soft keyboard.

**Parameters:**
- `error`: Error message if paste failed, otherwise `null`
- `files`: Array of pasted files

#### `smartPunctuation?: 'default' | 'enable' | 'disable'` (iOS only)
Controls iOS smart punctuation behavior.

**Default:** `'default'`

### Types

```typescript
interface PastedFile {
  fileName: string;
  fileSize: number;
  type: string;      // MIME type
  uri: string;       // file:// URI
}

type PasteInputRef = TextInput; // Fully compatible with TextInput ref
```

## Architecture

This library uses a hybrid approach to provide paste interception across platforms:

### iOS
- Uses a **TurboModule** with dynamic subclassing (ISA swizzling)
- Wraps standard React Native `TextInput` (100% compatible)
- Registers the TextInput ref with the native module on mount
- Intercepts paste events at the UIKit level
- Works in both bridgeless and bridge modes

### Android
- Uses a custom **ComponentView** that extends `ReactEditText`
- Overrides `onCreateInputConnection` to intercept paste via `InputConnectionCompat`
- Handles clipboard content from various sources (images, files, Google Docs, etc.)
- Fully compatible with TextInput API

## Compatibility

| React Native Version | Supported |
|---------------------|-----------|
| 0.83.x | ✅ |
| 0.82.x | ✅ |
| 0.81.x | ✅ |
| 0.80.x | ✅ |
| 0.79.x | ✅ |
| 0.78.x | ✅ |
| 0.77.x | ✅ |
| 0.76.x | ✅ |
| < 0.76 | ❌ (Old Architecture not supported) |

## Troubleshooting

### iOS: Views not being registered

If you see errors about views not being found:
1. Ensure you've set up the `reactHost` in AppDelegate (see iOS Setup above)
2. Make sure you've run `pod install` after adding the library
3. Clean build folder and rebuild: `cd ios && rm -rf build && cd .. && npx react-native run-ios`

### Android: Build errors

If you encounter build errors:
1. Clean the build: `cd android && ./gradlew clean && cd ..`
2. Rebuild: `npx react-native run-android`

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
