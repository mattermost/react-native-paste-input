import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import {
    requireNativeComponent,
    TouchableWithoutFeedback,
    type NativeSyntheticEvent,
    type TextInputChangeEventData,
    type TextInputSelectionChangeEventData,
    type TextInputFocusEventData,
    type TextInputScrollEventData,
    TextInput,
} from 'react-native';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
import TextAncestor from 'react-native/Libraries/Text/TextAncestor';
import setAndForwardRef from './setAndForwardRef';
import { getTextInputExtraProps } from './extra_props';

import type {
    PasteEvent,
    PasteInputProps,
    RCTPasteInputProps,
    Selection,
    TextInputNativeCommands,
} from './types';

const RCTPasteInput = requireNativeComponent<RCTPasteInputProps>('PasteInput');

const PasteInput = forwardRef((props: PasteInputProps, ref) => {
    let selection: Selection | undefined = useMemo(
        () =>
            !props.selection
                ? undefined
                : {
                      start: props.selection.start,
                      end: props.selection.end ?? props.selection.start,
                  },
        [props.selection]
    );

    const inputRef = useRef<null | TextInput>(null);
    const [mostRecentEventCount, setMostRecentEventCount] = useState<number>(0);
    const [lastNativeText, setLastNativeText] = useState<
        string | null | undefined
    >(null);
    const [lastNativeSelectionState, setLastNativeSelection] = useState<{
        selection?: Selection;
        mostRecentEventCount: number;
    }>({ selection, mostRecentEventCount });
    const text =
        typeof props.value === 'string'
            ? props.value
            : typeof props.defaultValue === 'string'
            ? props.defaultValue
            : '';

    const viewCommands: TextInputNativeCommands =
        require('react-native/Libraries/Components/TextInput/RCTMultilineTextInputNativeComponent').Commands;
    const lastNativeSelection = lastNativeSelectionState.selection;
    const lastNativeSelectionEventCount =
        lastNativeSelectionState.mostRecentEventCount;

    if (lastNativeSelectionEventCount < mostRecentEventCount) {
        selection = undefined;
    }

    // This is necessary in case native updates the text and JS decides
    // that the update should be ignored and we should stick with the value
    // that we have in JS.
    useEffect(() => {
        const nativeUpdate: { text?: string; selection?: Selection } = {};

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

    useEffect(() => {
        const inputRefValue = inputRef.current;

        if (inputRefValue != null) {
            TextInputState.registerInput(inputRefValue);
        }

        return () => {
            if (inputRefValue != null) {
                TextInputState.unregisterInput(inputRefValue);
            }
        };
    }, []);

    useEffect(() => {
        const inputRefValue = inputRef.current;
        // When unmounting we need to blur the input
        return () => {
            inputRefValue?.blur();
        };
    }, []);

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

    function blur() {
        if (inputRef.current != null) {
            viewCommands.blur(inputRef.current);
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
        getForwardedRef: () => ref,
        setLocalRef: (localRef: any) => {
            inputRef.current = localRef;

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
            if (localRef) {
                localRef.blur = blur;
                localRef.clear = clear;
                localRef.isFocused = isFocused;
                localRef.getNativeRef = getNativeRef;
            }
        },
    });

    const _onBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        TextInputState.blurInput(inputRef.current);
        if (props.onBlur) {
            props.onBlur(event);
        }
    };

    const _onChange = (
        event: NativeSyntheticEvent<TextInputChangeEventData>
    ) => {
        const value = event.nativeEvent.text;
        props.onChange && props.onChange(event);
        props.onChangeText && props.onChangeText(value);

        if (inputRef.current == null) {
            // calling `props.onChange` or `props.onChangeText`
            // may clean up the input itself. Exits here.
            return;
        }

        setLastNativeText(value);
        // This must happen last, after we call setLastNativeText.
        // Different ordering can cause bugs when editing AndroidTextInputs
        // with multiple Fragments.
        // We must update this so that controlled input updates work.
        setMostRecentEventCount(event.nativeEvent.eventCount);
    };

    const _onFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        TextInputState.focusInput(inputRef.current);
        if (props.onFocus) {
            props.onFocus(event);
        }
    };

    const _onPaste = (event: PasteEvent) => {
        if (props.onPaste) {
            const { data, error } = event.nativeEvent;
            props.onPaste(error?.message, data);
        }
    };

    const _onScroll = (
        event: NativeSyntheticEvent<TextInputScrollEventData>
    ) => {
        props.onScroll && props.onScroll(event);
    };

    const _onSelectionChange = (
        event: NativeSyntheticEvent<TextInputSelectionChangeEventData>
    ) => {
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

    const extraProps = getTextInputExtraProps(props);
    const smartPuntuation = props.smartPunctuation || 'default';

    return (
        <TextAncestor.Provider value={true}>
            <TouchableWithoutFeedback
                onLayout={props.onLayout}
                onPressIn={props.onPressIn}
                onPressOut={props.onPressOut}
                accessible={props.accessible}
                accessibilityLabel={props.accessibilityLabel}
                accessibilityRole={props.accessibilityRole}
                accessibilityState={props.accessibilityState}
                testID={props.testID}
            >
                <RCTPasteInput
                    {...props}
                    {...extraProps}
                    autoCapitalize={props.autoCapitalize || 'sentences'}
                    dataDetectorTypes={props.dataDetectorTypes}
                    disableFullscreenUI={props.disableFullscreenUI}
                    mostRecentEventCount={mostRecentEventCount}
                    onBlur={_onBlur}
                    onChange={_onChange}
                    onContentSizeChange={props.onContentSizeChange}
                    onFocus={_onFocus}
                    onPaste={_onPaste}
                    onScroll={_onScroll}
                    onSelectionChange={_onSelectionChange}
                    selection={selection}
                    smartPunctuation={smartPuntuation}
                    style={[props.style]}
                    textBreakStrategy={props.textBreakStrategy}
                    //@ts-ignore
                    ref={_setNativeRef}
                />
            </TouchableWithoutFeedback>
        </TextAncestor.Provider>
    );
});

export default PasteInput;
