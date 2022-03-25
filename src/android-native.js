/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import * as NativeComponentRegistry from 'react-native/Libraries/NativeComponent/NativeComponentRegistry';

export const Commands = codegenNativeCommands({
    supportedCommands: ['focus', 'blur', 'setTextAndSelection'],
});

let AndroidTextInputNativeComponent = NativeComponentRegistry.get(
    'PasteInput',
    () => ({
        uiViewClassName: 'AndroidTextInput',
        bubblingEventTypes: {
            topBlur: {
                phasedRegistrationNames: {
                    bubbled: 'onBlur',
                    captured: 'onBlurCapture',
                },
            },
            topEndEditing: {
                phasedRegistrationNames: {
                    bubbled: 'onEndEditing',
                    captured: 'onEndEditingCapture',
                },
            },
            topFocus: {
                phasedRegistrationNames: {
                    bubbled: 'onFocus',
                    captured: 'onFocusCapture',
                },
            },
            topKeyPress: {
                phasedRegistrationNames: {
                    bubbled: 'onKeyPress',
                    captured: 'onKeyPressCapture',
                },
            },
            topSubmitEditing: {
                phasedRegistrationNames: {
                    bubbled: 'onSubmitEditing',
                    captured: 'onSubmitEditingCapture',
                },
            },
            topTextInput: {
                phasedRegistrationNames: {
                    bubbled: 'onTextInput',
                    captured: 'onTextInputCapture',
                },
            },
        },
        directEventTypes: {},
        validAttributes: {
            maxFontSizeMultiplier: true,
            adjustsFontSizeToFit: true,
            minimumFontScale: true,
            autoFocus: true,
            placeholder: true,
            inlineImagePadding: true,
            contextMenuHidden: true,
            textShadowColor: {
                process: require('react-native/Libraries/StyleSheet/processColor'),
            },
            maxLength: true,
            selectTextOnFocus: true,
            textShadowRadius: true,
            underlineColorAndroid: {
                process: require('react-native/Libraries/StyleSheet/processColor'),
            },
            textDecorationLine: true,
            blurOnSubmit: true,
            textAlignVertical: true,
            fontStyle: true,
            textShadowOffset: true,
            selectionColor: {
                process: require('react-native/Libraries/StyleSheet/processColor'),
            },
            selection: true,
            placeholderTextColor: {
                process: require('react-native/Libraries/StyleSheet/processColor'),
            },
            importantForAutofill: true,
            lineHeight: true,
            textTransform: true,
            returnKeyType: true,
            keyboardType: true,
            multiline: true,
            color: {
                process: require('react-native/Libraries/StyleSheet/processColor'),
            },
            autoCompleteType: true,
            autoComplete: true,
            numberOfLines: true,
            letterSpacing: true,
            returnKeyLabel: true,
            fontSize: true,
            onKeyPress: true,
            cursorColor: {
                process: require('react-native/Libraries/StyleSheet/processColor'),
            },
            text: true,
            showSoftInputOnFocus: true,
            textAlign: true,
            autoCapitalize: true,
            autoCorrect: true,
            caretHidden: true,
            secureTextEntry: true,
            textBreakStrategy: true,
            onScroll: true,
            onContentSizeChange: true,
            disableFullscreenUI: true,
            includeFontPadding: true,
            fontWeight: true,
            fontFamily: true,
            allowFontScaling: true,
            onSelectionChange: true,
            mostRecentEventCount: true,
            inlineImageLeft: true,
            editable: true,
            fontVariant: true,
        },
    })
);

export default AndroidTextInputNativeComponent;
