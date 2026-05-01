import * as React from 'react';
import invariant from 'invariant';
import PasteTextInputNativeComponent, {
    Commands,
} from './PasteTextInputNativeComponent';
import type {
    PasteEvent,
    PasteInputProps,
    PasteTextInputInstance,
    Selection,
    SubmitBehavior,
} from './types';
import {
    Platform,
    Text,
    type HostComponent,
    type KeyboardTypeOptions,
    type NativeSyntheticEvent,
    type NativeTouchEvent,
    type ReturnKeyTypeOptions,
    type TextInputProps,
} from 'react-native';

import TextAncestor from 'react-native/Libraries/Text/TextAncestor';
import TextInputState from 'react-native/Libraries/Components/TextInput/TextInputState';
import usePressability from 'react-native/Libraries/Pressability/usePressability';
import flattenStyle from 'react-native/Libraries/StyleSheet/flattenStyle';
import nullthrows from 'nullthrows';

const emptyFunctionThatReturnsTrue = () => true;

function useMergeRefs<Instance>(
    ...refs: ReadonlyArray<React.ForwardedRef<Instance> | null | undefined>
): (arg0: Instance | null) => void {
    return React.useCallback(
        (current: Instance | null) => {
            for (const ref of refs) {
                if (ref != null) {
                    if (typeof ref === 'function') {
                        ref(current);
                    } else {
                        (
                            ref as React.MutableRefObject<Instance | null>
                        ).current = current;
                    }
                }
            }
        },
        [...refs]
    );
}

function InternalTextInput(props: PasteInputProps): React.ReactNode {
    const {
        'aria-busy': ariaBusy,
        'aria-checked': ariaChecked,
        'aria-disabled': ariaDisabled,
        'aria-expanded': ariaExpanded,
        'aria-selected': ariaSelected,
        accessibilityState,
        id,
        tabIndex,
        'selection': propsSelection,
        selectionColor,
        selectionHandleColor,
        cursorColor,
        ...otherProps
    } = props;

    const inputRef = React.useRef<null | React.ElementRef<
        HostComponent<unknown>
    >>(null);

    const selection: Selection | null = React.useMemo(
        () =>
            propsSelection == null
                ? null
                : {
                      start: propsSelection.start,
                      end: propsSelection.end ?? propsSelection.start,
                  },
        [propsSelection]
    );

    const [mostRecentEventCount, setMostRecentEventCount] =
        React.useState<number>(0);
    const [lastNativeText, setLastNativeText] = React.useState<
        string | undefined
    >(props.value);
    const [lastNativeSelectionState, setLastNativeSelection] = React.useState<{
        selection: Required<Selection>;
        mostRecentEventCount: number;
    }>({
        selection: { start: -1, end: -1 },
        mostRecentEventCount,
    });

    const lastNativeSelection = lastNativeSelectionState.selection;

    const text =
        typeof props.value === 'string'
            ? props.value
            : typeof props.defaultValue === 'string'
              ? props.defaultValue
              : undefined;

    React.useLayoutEffect(() => {
        const nativeUpdate: {
            text?: string;
            selection?: Required<Selection>;
        } = {};

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
            nativeUpdate.selection = selection as Required<Selection>;
            setLastNativeSelection({
                selection: selection as Required<Selection>,
                mostRecentEventCount,
            });
        }

        if (Object.keys(nativeUpdate).length === 0) {
            return;
        }

        if (inputRef.current != null) {
            Commands.setTextAndSelection(
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
    ]);

    React.useLayoutEffect(() => {
        const inputRefValue = inputRef.current;

        if (inputRefValue != null) {
            TextInputState.registerInput(inputRefValue);
        }

        return () => {
            if (inputRefValue != null) {
                TextInputState.unregisterInput(inputRefValue);
            }

            if (TextInputState.currentlyFocusedInput() === inputRefValue) {
                nullthrows(inputRefValue).blur();
            }
        };
    }, [inputRef]);

    const setLocalRef = React.useCallback(
        (instance: PasteTextInputInstance | null) => {
            inputRef.current = instance;
            if (instance != null) {
                TextInputState.registerInput(instance);

                Object.assign(instance, {
                    clear(): void {
                        if (inputRef.current != null) {
                            Commands.setTextAndSelection(
                                inputRef.current,
                                mostRecentEventCount,
                                '',
                                0,
                                0
                            );
                        }
                    },
                    isFocused(): boolean {
                        return (
                            TextInputState.currentlyFocusedInput() ===
                            inputRef.current
                        );
                    },
                    getNativeRef(): null | React.ElementRef<
                        HostComponent<unknown>
                    > {
                        return inputRef.current;
                    },
                    setSelection(start: number, end: number): void {
                        if (inputRef.current != null) {
                            Commands.setTextAndSelection(
                                inputRef.current,
                                mostRecentEventCount,
                                null,
                                start,
                                end
                            );
                        }
                    },
                });
            }
        },
        [mostRecentEventCount]
    );

    const ref = useMergeRefs<PasteTextInputInstance>(
        setLocalRef,
        props.forwardedRef
    );

    const _onChange = (
        event: Parameters<NonNullable<TextInputProps['onChange']>>[0]
    ) => {
        const currentText = event.nativeEvent.text;
        props.onChange && props.onChange(event);
        props.onChangeText && props.onChangeText(currentText);

        if (inputRef.current == null) {
            return;
        }

        setLastNativeText(currentText);
        setMostRecentEventCount(event.nativeEvent.eventCount);
    };

    const _onBlur = (
        event: Parameters<NonNullable<TextInputProps['onBlur']>>[0]
    ) => {
        TextInputState.blurInput(inputRef.current);
        if (props.onBlur) {
            props.onBlur(event);
        }
    };

    const _onFocus = (
        event: Parameters<NonNullable<TextInputProps['onFocus']>>[0]
    ) => {
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
        event: Parameters<NonNullable<TextInputProps['onScroll']>>[0]
    ) => {
        props.onScroll && props.onScroll(event);
    };

    const _onSelectionChange = (
        event: Parameters<NonNullable<TextInputProps['onSelectionChange']>>[0]
    ) => {
        props.onSelectionChange && props.onSelectionChange(event);

        if (inputRef.current == null) {
            return;
        }

        setLastNativeSelection({
            selection: event.nativeEvent.selection,
            mostRecentEventCount,
        });
    };

    const multiline = props.multiline ?? false;

    let submitBehavior: SubmitBehavior;
    if (props.submitBehavior != null) {
        if (!multiline && props.submitBehavior === 'newline') {
            submitBehavior = 'blurAndSubmit';
        } else {
            submitBehavior = props.submitBehavior;
        }
    } else if (multiline) {
        if (props.blurOnSubmit === true) {
            submitBehavior = 'blurAndSubmit';
        } else {
            submitBehavior = 'newline';
        }
    } else {
        if (props.blurOnSubmit !== false) {
            submitBehavior = 'blurAndSubmit';
        } else {
            submitBehavior = 'submit';
        }
    }

    const accessible = props.accessible !== false;
    const focusable = props.focusable !== false;

    const { editable, hitSlop, onPress, onPressIn, onPressOut } = props;

    const config = React.useMemo(
        () => ({
            hitSlop,
            onPress: (event: NativeSyntheticEvent<NativeTouchEvent>) => {
                onPress?.(event);
                if (editable !== false) {
                    if (inputRef.current != null) {
                        inputRef.current.focus();
                    }
                }
            },
            onPressIn: onPressIn,
            onPressOut: onPressOut,
            cancelable: null, // Android does not use this
        }),
        [editable, hitSlop, onPress, onPressIn, onPressOut]
    );

    let caretHidden = props.caretHidden;
    if (Platform.isTesting) {
        caretHidden = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onBlur, onFocus, ...eventHandlers } = usePressability(config) || {};

    let _accessibilityState:
        | {
              busy?: boolean;
              checked?: boolean | 'mixed';
              disabled?: boolean;
              expanded?: boolean;
              selected?: boolean;
          }
        | undefined;
    if (
        accessibilityState != null ||
        ariaBusy != null ||
        ariaChecked != null ||
        ariaDisabled != null ||
        ariaExpanded != null ||
        ariaSelected != null
    ) {
        _accessibilityState = {
            busy: ariaBusy ?? accessibilityState?.busy,
            checked: ariaChecked ?? accessibilityState?.checked,
            disabled: ariaDisabled ?? accessibilityState?.disabled,
            expanded: ariaExpanded ?? accessibilityState?.expanded,
            selected: ariaSelected ?? accessibilityState?.selected,
        };
    }

    // Keep original (potentially nested) style; only flatten to check for overrides
    let _style = props.style;
    // @ts-ignore
    const flattenedStyle = flattenStyle(props.style);
    if (flattenedStyle != null) {
        let overrides: Record<string, unknown> | null = null;

        if (typeof flattenedStyle.fontWeight === 'number') {
            overrides = overrides ?? {};
            overrides.fontWeight = flattenedStyle.fontWeight.toString();
        }

        if (flattenedStyle.verticalAlign != null) {
            overrides = overrides ?? {};
            overrides.textAlignVertical =
                verticalAlignToTextAlignVerticalMap[
                    flattenedStyle.verticalAlign as keyof typeof verticalAlignToTextAlignVerticalMap
                ];
            overrides.verticalAlign = undefined;
        }

        if (overrides != null) {
            _style = [_style, overrides];
        }
    }

    const _accessibilityLabel =
        props?.['aria-label'] ?? props?.accessibilityLabel;
    const _accessibilityLabelledBy =
        props?.['aria-labelledby'] ?? props?.accessibilityLabelledBy;
    const _importantForAccessibility =
        props['aria-hidden'] === true
            ? ('no-hide-descendants' as const)
            : undefined;
    const autoCapitalize = props.autoCapitalize || 'sentences';
    const placeholder = props.placeholder ?? '';

    let children = props.children;
    const childCount = React.Children.count(children);
    invariant(
        !(props.value != null && childCount),
        'Cannot specify both value and children.'
    );
    if (childCount > 1) {
        children = <Text>{children}</Text>;
    }

    const colorProps = {
        selectionColor,
        selectionHandleColor:
            selectionHandleColor === undefined
                ? selectionColor
                : selectionHandleColor,
        cursorColor: cursorColor === undefined ? selectionColor : cursorColor,
    };

    const textInput = (
        <PasteTextInputNativeComponent
            ref={ref}
            {...otherProps}
            {...colorProps}
            {...eventHandlers}
            accessibilityLabel={_accessibilityLabel}
            accessibilityLabelledBy={_accessibilityLabelledBy}
            accessibilityState={_accessibilityState}
            accessible={accessible}
            autoCapitalize={autoCapitalize}
            submitBehavior={submitBehavior}
            caretHidden={caretHidden}
            children={children}
            disableFullscreenUI={props.disableFullscreenUI}
            focusable={tabIndex !== undefined ? !tabIndex : focusable}
            importantForAccessibility={_importantForAccessibility}
            mostRecentEventCount={mostRecentEventCount}
            nativeID={id ?? props.nativeID}
            numberOfLines={props.rows ?? props.numberOfLines}
            onBlur={_onBlur}
            onChange={_onChange}
            onContentSizeChange={props.onContentSizeChange}
            onFocus={_onFocus}
            onPaste={_onPaste}
            onScroll={_onScroll}
            onSelectionChange={_onSelectionChange}
            onSelectionChangeShouldSetResponder={emptyFunctionThatReturnsTrue}
            placeholder={placeholder}
            style={_style}
            text={text}
            textBreakStrategy={props.textBreakStrategy}
        />
    );

    return (
        <TextAncestor.Provider value={true}>{textInput}</TextAncestor.Provider>
    );
}

const enterKeyHintToReturnTypeMap: Record<string, ReturnKeyTypeOptions> = {
    enter: 'default',
    done: 'done',
    go: 'go',
    next: 'next',
    previous: 'previous',
    search: 'search',
    send: 'send',
};

const inputModeToKeyboardTypeMap: Record<string, KeyboardTypeOptions> = {
    none: 'default',
    text: 'default',
    decimal: 'decimal-pad',
    numeric: 'number-pad',
    tel: 'phone-pad',
    search: 'default', // Android has no web-search keyboard type
    email: 'email-address',
    url: 'url',
};

const autoCompleteWebToAutoCompleteAndroidMap: Record<string, string> = {
    'address-line1': 'postal-address-region',
    'address-line2': 'postal-address-locality',
    'bday': 'birthdate-full',
    'bday-day': 'birthdate-day',
    'bday-month': 'birthdate-month',
    'bday-year': 'birthdate-year',
    'cc-csc': 'cc-csc',
    'cc-exp': 'cc-exp',
    'cc-exp-month': 'cc-exp-month',
    'cc-exp-year': 'cc-exp-year',
    'cc-number': 'cc-number',
    'country': 'postal-address-country',
    'current-password': 'password',
    'email': 'email',
    'honorific-prefix': 'name-prefix',
    'honorific-suffix': 'name-suffix',
    'name': 'name',
    'additional-name': 'name-middle',
    'family-name': 'name-family',
    'given-name': 'name-given',
    'new-password': 'password-new',
    'off': 'off',
    'one-time-code': 'sms-otp',
    'postal-code': 'postal-code',
    'sex': 'gender',
    'street-address': 'street-address',
    'tel': 'tel',
    'tel-country-code': 'tel-country-code',
    'tel-national': 'tel-national',
    'username': 'username',
};

const verticalAlignToTextAlignVerticalMap = {
    auto: 'auto',
    top: 'top',
    bottom: 'bottom',
    middle: 'center',
} as const;

const ExportedForwardRef = React.forwardRef(function PasteTextInput(
    {
        allowFontScaling = true,
        underlineColorAndroid = 'transparent',
        autoComplete,
        readOnly,
        editable,
        enterKeyHint,
        returnKeyType,
        inputMode,
        showSoftInputOnFocus,
        keyboardType,
        ...restProps
    }: PasteInputProps,
    forwardedRef: React.ForwardedRef<PasteTextInputInstance>
) {
    return (
        <InternalTextInput
            allowFontScaling={allowFontScaling}
            underlineColorAndroid={underlineColorAndroid}
            editable={readOnly !== undefined ? !readOnly : editable}
            returnKeyType={
                enterKeyHint
                    ? enterKeyHintToReturnTypeMap[enterKeyHint]
                    : returnKeyType
            }
            keyboardType={
                inputMode ? inputModeToKeyboardTypeMap[inputMode] : keyboardType
            }
            showSoftInputOnFocus={
                inputMode == null ? showSoftInputOnFocus : inputMode !== 'none'
            }
            autoComplete={
                // @ts-ignore
                (autoCompleteWebToAutoCompleteAndroidMap[autoComplete!] ??
                    autoComplete) as PasteInputProps['autoComplete']
            }
            {...restProps}
            forwardedRef={forwardedRef}
        />
    );
});

ExportedForwardRef.displayName = 'PasteTextInput';

export default ExportedForwardRef;
