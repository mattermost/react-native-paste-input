import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Platform,
    requireNativeComponent,
    TextInputProps,
    TouchableWithoutFeedback,
    HostComponent,
    NativeSyntheticEvent,
    TextInputChangeEventData,
    TextInputSelectionChangeEventData,
    TextInputFocusEventData,
    TextInputScrollEventData,
} from 'react-native';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
import TextAncestor from 'react-native/Libraries/Text/TextAncestor';

export interface PastedFile {
    fileName: string;
    fileSize: number;
    type: string;
    uri: string;
}

interface PasteEvent {
    nativeEvent: {
        data: Array<PastedFile>;
        error?: {
            message: string;
        };
    };
}

interface PasteInputProps extends TextInputProps {
    disableCopyPaste?: boolean;
    onPaste(error: string | null | undefined, files: Array<PastedFile>): void;
}

interface RCTPasteInputProps extends TextInputProps {
    disableCopyPaste?: boolean;
    mostRecentEventCount: number;
    onPaste(event: PasteEvent): void;
}

export interface PasteInputRef {
    clear(): void;
    isFocused(): boolean;
    focus(): void;
    blur(): void;
    setNativeProps(nativeProps: object): void;
}

interface TextInputNativeCommands {
    focus: (viewRef: unknown) => void;
    blur: (viewRef: unknown) => void;
    setTextAndSelection: (
        viewRef: unknown,
        mostRecentEventCount: number,
        value: string | null, // in theory this is nullable
        start: number,
        end: number
    ) => void;
}

interface Selection {
    start: number;
    end?: number | undefined;
}

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

    const inputRef = useRef<null | React.ElementRef<HostComponent<any>>>(null);
    const [mostRecentEventCount, setMostRecentEventCount] = useState<number>(0);
    const [lastNativeText, setLastNativeText] = useState<
        string | null | undefined
    >(props.value);
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

    let viewCommands: TextInputNativeCommands;
    if (Platform.OS === 'android') {
        viewCommands =
            require('react-native/Libraries/Components/TextInput/AndroidTextInputNativeComponent').Commands;
    } else {
        viewCommands =
            require('react-native/Libraries/Components/TextInput/RCTMultilineTextInputNativeComponent').Commands;
    }

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
    }, [inputRef]);

    useEffect(() => {
        const inputRefValue = inputRef.current;
        // When unmounting we need to blur the input
        return () => {
            if (isFocused()) {
                inputRefValue?.blur();
            }
        };
    }, [inputRef]);

    const clear = useCallback(() => {
        if (inputRef.current != null) {
            viewCommands.setTextAndSelection(
                inputRef.current,
                mostRecentEventCount,
                '',
                0,
                0
            );
        }
    }, [mostRecentEventCount, viewCommands]);

    useImperativeHandle(
        ref,
        () => ({
            clear,
            isFocused,
            focus: () => inputRef.current?.focus(),
            blur: () => inputRef.current?.blur(),
            setNativeProps: inputRef.current?.setNativeProps,
            ...(inputRef.current || {}),
        }),
        [clear]
    );

    function isFocused(): boolean {
        if (!inputRef.current) {
            return false;
        }

        return TextInputState.currentlyFocusedInput() === inputRef.current;
    }

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

    const _onPress = () => {
        if ((props.editable || props.editable === undefined) && !isFocused()) {
            inputRef.current?.focus();
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

    return (
        <TextAncestor.Provider value={true}>
            <TouchableWithoutFeedback
                onLayout={props.onLayout}
                onPress={_onPress}
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
                    style={[props.style]}
                    textBreakStrategy={props.textBreakStrategy}
                    ref={inputRef}
                />
            </TouchableWithoutFeedback>
        </TextAncestor.Provider>
    );
});

export default PasteInput;
