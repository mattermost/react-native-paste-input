# @mattermost/react-native-paste-input

React Native `TextInput` component have functionality to capture text input from a user
by using the soft and hardware keyboards but lacks the ability to restrict copy & paste options
as well as allwing pasting different files formats copied from other apps, like images & videos from
the Photos gallery app.

`PasteInput` is a `TextInput` replacement that solves this issues.

## Installation

```sh
npm install @mattermost/react-native-paste-input
```

## Demo
| Android | iOS |
|-- |-- |
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
        console.log('ERROR', error);
        console.log('PASTED FILES', files);
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
            autoCompleteType="off"
        />
    );
}
```

### Properties
All properties of the [TextInput](!https://reactnative.dev/docs/textinput) component plus:

##### `disableCopyPaste: boolean`
Indicates if the menu items for *cut*, *copy*, *paste* and *share* should not be present in the context menu.

##### `onPaste: (error, files) =>  void`
Callback that is called when the pasting files into the text input.
*Note: On Android this callback is also called when selecting and image / gif from the soft keyboard.*

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
