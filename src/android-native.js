/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import AndroidTextInputViewConfig from 'react-native/Libraries/Components/TextInput/AndroidTextInputViewConfig';
import * as NativeComponentRegistry from 'react-native/Libraries/NativeComponent/NativeComponentRegistry';

export const Commands = codegenNativeCommands({
    supportedCommands: ['focus', 'blur', 'setTextAndSelection'],
});

let AndroidTextInputNativeComponent = NativeComponentRegistry.get(
    'PasteInput',
    () => AndroidTextInputViewConfig
);

export default AndroidTextInputNativeComponent;
