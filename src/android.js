/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';

import DeprecatedTextInputPropTypes from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedTextInputPropTypes';

import Platform from 'react-native/Libraries/Utilities/Platform';
import Text from 'react-native/Libraries/Text/Text';
import TextAncestor from 'react-native/Libraries/Text/TextAncestor';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
import invariant from 'invariant';
import nullthrows from 'nullthrows';
import setAndForwardRef from 'react-native/Libraries/Utilities/setAndForwardRef';

import usePressability from 'react-native/Libraries/Pressability/usePressability';

const { useLayoutEffect, useRef, useState } = React;

let AndroidTextInput;
let AndroidTextInputCommands;

AndroidTextInput = require('./android-native').default;
AndroidTextInputCommands = require('./android-native').Commands;

function InternalTextInput(props) {
    const inputRef = useRef(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let selection =
        props.selection == null
            ? null
            : {
                  start: props.selection.start,
                  end: props.selection.end ?? props.selection.start,
              };

    const [mostRecentEventCount, setMostRecentEventCount] = useState(0);

    const [lastNativeText, setLastNativeText] = useState(props.value);
    const [lastNativeSelectionState, setLastNativeSelection] = useState({
        selection,
        mostRecentEventCount,
    });

    const lastNativeSelection = lastNativeSelectionState.selection;
    const lastNativeSelectionEventCount =
        lastNativeSelectionState.mostRecentEventCount;

    if (lastNativeSelectionEventCount < mostRecentEventCount) {
        selection = null;
    }

    const viewCommands = AndroidTextInputCommands;

    const text =
        typeof props.value === 'string'
            ? props.value
            : typeof props.defaultValue === 'string'
            ? props.defaultValue
            : '';

    // This is necessary in case native updates the text and JS decides
    // that the update should be ignored and we should stick with the value
    // that we have in JS.
    useLayoutEffect(() => {
        const nativeUpdate = {};

        if (lastNativeText !== props.value && typeof props.value === 'string') {
            nativeUpdate.text = props.value;
            setLastNativeText(props.value);
        }

        if (
            selection &&
            lastNativeSelection &&
            (lastNativeSelection.start !== selection.start ||
                lastNativeSelection.end !== selection.end)
        ) {
            nativeUpdate.selection = selection;
            setLastNativeSelection({ selection, mostRecentEventCount });
        }

        if (Object.keys(nativeUpdate).length === 0) {
            return;
        }

        if (inputRef.current != null) {
            viewCommands.setTextAndSelection(
                inputRef.current,
                mostRecentEventCount,
                text,
                selection?.start ?? -1,
                selection?.end ?? -1
            );
        }
    }, [
        mostRecentEventCount,
        inputRef,
        props.value,
        props.defaultValue,
        lastNativeText,
        selection,
        lastNativeSelection,
        text,
        viewCommands,
    ]);

    useLayoutEffect(() => {
        const inputRefValue = inputRef.current;

        if (inputRefValue != null) {
            TextInputState.registerInput(inputRefValue);

            return () => {
                TextInputState.unregisterInput(inputRefValue);

                if (TextInputState.currentlyFocusedInput() === inputRefValue) {
                    nullthrows(inputRefValue).blur();
                }
            };
        }
    }, [inputRef]);

    function clear() {
        if (inputRef.current != null) {
            viewCommands.setTextAndSelection(
                inputRef.current,
                mostRecentEventCount,
                '',
                0,
                0
            );
        }
    }

    // TODO: Fix this returning true on null === null, when no input is focused
    function isFocused() {
        return TextInputState.currentlyFocusedInput() === inputRef.current;
    }

    function getNativeRef() {
        return inputRef.current;
    }

    const _setNativeRef = setAndForwardRef({
        getForwardedRef: () => props.forwardedRef,
        setLocalRef: (ref) => {
            inputRef.current = ref;

            /*
         Hi reader from the future. I'm sorry for this.
 
         This is a hack. Ideally we would forwardRef to the underlying
         host component. However, since TextInput has it's own methods that can be
         called as well, if we used the standard forwardRef then these
         methods wouldn't be accessible and thus be a breaking change.
 
         We have a couple of options of how to handle this:
         - Return a new ref with everything we methods from both. This is problematic
           because we need React to also know it is a host component which requires
           internals of the class implementation of the ref.
         - Break the API and have some other way to call one set of the methods or
           the other. This is our long term approach as we want to eventually
           get the methods on host components off the ref. So instead of calling
           ref.measure() you might call ReactNative.measure(ref). This would hopefully
           let the ref for TextInput then have the methods like `.clear`. Or we do it
           the other way and make it TextInput.clear(textInputRef) which would be fine
           too. Either way though is a breaking change that is longer term.
         - Mutate this ref. :( Gross, but accomplishes what we need in the meantime
           before we can get to the long term breaking change.
         */
            if (ref) {
                ref.clear = clear;
                ref.isFocused = isFocused;
                ref.getNativeRef = getNativeRef;
            }
        },
    });

    const _onChange = (event) => {
        // eslint-disable-next-line no-shadow
        const text = event.nativeEvent.text;
        props.onChange && props.onChange(event);
        props.onChangeText && props.onChangeText(text);

        if (inputRef.current == null) {
            // calling `props.onChange` or `props.onChangeText`
            // may clean up the input itself. Exits here.
            return;
        }

        setLastNativeText(text);
        // This must happen last, after we call setLastNativeText.
        // Different ordering can cause bugs when editing AndroidTextInputs
        // with multiple Fragments.
        // We must update this so that controlled input updates work.
        setMostRecentEventCount(event.nativeEvent.eventCount);
    };

    const _onSelectionChange = (event) => {
        props.onSelectionChange && props.onSelectionChange(event);

        if (inputRef.current == null) {
            // calling `props.onSelectionChange`
            // may clean up the input itself. Exits here.
            return;
        }

        setLastNativeSelection({
            selection: event.nativeEvent.selection,
            mostRecentEventCount,
        });
    };

    const _onFocus = (event) => {
        TextInputState.focusInput(inputRef.current);
        if (props.onFocus) {
            props.onFocus(event);
        }
    };

    const _onBlur = (event) => {
        TextInputState.blurInput(inputRef.current);
        if (props.onBlur) {
            props.onBlur(event);
        }
    };

    const _onScroll = (event) => {
        props.onScroll && props.onScroll(event);
    };

    const _onPaste = (event) => {
        if (props.onPaste) {
            const { data, error } = event.nativeEvent;
            props.onPaste(error?.message, data);
        }
    };

    let textInput = null;

    // The default value for `blurOnSubmit` is true for single-line fields and
    // false for multi-line fields.
    const blurOnSubmit = props.blurOnSubmit ?? !props.multiline;

    const accessible = props.accessible !== false;
    const focusable = props.focusable !== false;

    const config = React.useMemo(
        () => ({
            onPress: (event) => {
                if (props.editable !== false) {
                    nullthrows(inputRef.current).focus();
                }
            },
            onPressIn: props.onPressIn,
            onPressOut: props.onPressOut,
            cancelable: null,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            props.editable,
            props.onPressIn,
            props.onPressOut,
            props.rejectResponderTermination,
        ]
    );

    // Hide caret during test runs due to a flashing caret
    // makes screenshot tests flakey
    let caretHidden = props.caretHidden;
    if (Platform.isTesting) {
        caretHidden = true;
    }

    // TextInput handles onBlur and onFocus events
    // so omitting onBlur and onFocus pressability handlers here.
    const { onBlur, onFocus, ...eventHandlers } = usePressability(config) || {};

    const style = [props.style];
    const autoCapitalize = props.autoCapitalize || 'sentences';
    let children = props.children;
    const childCount = React.Children.count(children);
    invariant(
        !(props.value != null && childCount),
        'Cannot specify both value and children.'
    );
    if (childCount > 1) {
        children = <Text>{children}</Text>;
    }

    textInput = (
        /* $FlowFixMe[prop-missing] the types for AndroidTextInput don't match up
         * exactly with the props for TextInput. This will need to get fixed */
        /* $FlowFixMe[incompatible-type] the types for AndroidTextInput don't
         * match up exactly with the props for TextInput. This will need to get
         * fixed */
        /* $FlowFixMe[incompatible-type-arg] the types for AndroidTextInput don't
         * match up exactly with the props for TextInput. This will need to get
         * fixed */
        <AndroidTextInput
            ref={_setNativeRef}
            {...props}
            {...eventHandlers}
            accessible={accessible}
            autoCapitalize={autoCapitalize}
            blurOnSubmit={blurOnSubmit}
            caretHidden={caretHidden}
            children={children}
            disableFullscreenUI={props.disableFullscreenUI}
            focusable={focusable}
            mostRecentEventCount={mostRecentEventCount}
            onBlur={_onBlur}
            onChange={_onChange}
            onFocus={_onFocus}
            onPaste={_onPaste}
            /* $FlowFixMe[prop-missing] the types for AndroidTextInput don't match
             * up exactly with the props for TextInput. This will need to get fixed
             */
            /* $FlowFixMe[incompatible-type-arg] the types for AndroidTextInput
             * don't match up exactly with the props for TextInput. This will need
             * to get fixed */
            onScroll={_onScroll}
            onSelectionChange={_onSelectionChange}
            selection={selection}
            style={style}
            text={text}
            textBreakStrategy={props.textBreakStrategy}
        />
    );

    return (
        <TextAncestor.Provider value={true}>{textInput}</TextAncestor.Provider>
    );
}

const ExportedForwardRef = React.forwardRef(function TextInput(
    {
        allowFontScaling = true,
        rejectResponderTermination = true,
        underlineColorAndroid = 'transparent',
        ...restProps
    },
    forwardedRef
) {
    return (
        <InternalTextInput
            allowFontScaling={allowFontScaling}
            rejectResponderTermination={rejectResponderTermination}
            underlineColorAndroid={underlineColorAndroid}
            {...restProps}
            forwardedRef={forwardedRef}
        />
    );
});

// TODO: Deprecate this
ExportedForwardRef.propTypes = DeprecatedTextInputPropTypes;

// $FlowFixMe[prop-missing]
ExportedForwardRef.State = {
    currentlyFocusedInput: TextInputState.currentlyFocusedInput,

    currentlyFocusedField: TextInputState.currentlyFocusedField,
    focusTextInput: TextInputState.focusTextInput,
    blurTextInput: TextInputState.blurTextInput,
};

// $FlowFixMe[unclear-type] Unclear type. Using `any` type is not safe.
module.exports = ExportedForwardRef;
