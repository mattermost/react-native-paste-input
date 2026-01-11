/**
 * PasteInput - A TextInput wrapper that intercepts file paste events
 *
 * This component uses a hybrid approach:
 * - iOS: Wraps standard TextInput + TurboModule with dynamic subclassing
 * - Android: Uses custom PasteTextInput ComponentView (extends ReactEditText)
 *
 * Architecture:
 * iOS:
 * - Wraps standard React Native TextInput (100% compatible)
 * - Registers the TextInput ref with native module on mount
 * - Native module hooks into the backing UITextView for paste interception using ISA swizzling
 * - Emits events when files are pasted via TurboModule
 * - Unregisters on unmount
 *
 * Android:
 * - Renders custom PasteTextInput native component (extends ReactEditText)
 * - Overrides onCreateInputConnection to intercept paste via InputConnectionCompat
 * - Cannot do runtime method swizzling like iOS, so requires custom component
 * - Emits events when files are pasted via ViewManager event
 */

import React, {
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { Platform, TextInput, NativeEventEmitter } from 'react-native';
import type {
    PastedFile,
    PasteInputProps,
    PasteTextInputInstance,
} from './types';
import NativePasteInputModule from './NativePasteInputModule';
import PasteTextInput from './PasteTextInput';

// In Fabric, TurboModules can be used directly as the event emitter (iOS only)
const PasteInputEventEmitter =
    Platform.OS === 'ios'
        ? new NativeEventEmitter(NativePasteInputModule as any)
        : null;

function PasteInputIOSComponent(
    props: PasteInputProps,
    forwardedRef: React.ForwardedRef<PasteTextInputInstance>
) {
    const {
        onPaste,
        disableCopyPaste = false,
        smartPunctuation = 'default',
        ...textInputProps
    } = props;

    const textInputRef = useRef<TextInput>(null);
    const nativeIDRef = useRef<string | null>(null);

    // Expose the TextInput ref to parent components (same as Android)
    // TextInput already has all methods from PasteTextInputInstance (clear, isFocused, setSelection)
    useImperativeHandle(forwardedRef, () => {
        if (textInputRef.current) {
            return textInputRef.current as unknown as PasteTextInputInstance;
        }
        // Return a no-op implementation if ref is not yet available
        return {
            clear: () => {},
            isFocused: () => false,
            setSelection: () => {},
        } as unknown as PasteTextInputInstance;
    }, []);

    // Register/unregister with native module on mount/unmount
    useEffect(() => {
        // Get the native tag from the ref's internal __nativeTag property
        // @ts-ignore - __nativeTag is an internal property
        const nativeTag = textInputRef.current?.__nativeTag;

        if (!nativeTag) {
            if (__DEV__) {
                console.warn('[PasteInput] Could not get native tag from ref');
            }
            return;
        }

        // Use the actual React native tag as the identifier
        const nativeID = `PasteInput_${nativeTag}`;
        nativeIDRef.current = nativeID;

        // Register this TextInput instance by passing the nativeID
        NativePasteInputModule.registerTextInput(nativeID, {
            disableCopyPaste,
            smartPunctuation,
        });

        // Listen for paste events
        const subscription = PasteInputEventEmitter!.addListener(
            'onPaste',
            (event: {
                nativeID: string;
                data: PastedFile[];
                error?: string;
            }) => {
                // Only handle events for this instance
                if (event.nativeID === nativeID && onPaste) {
                    onPaste(event.error || null, event.data);
                }
            }
        );

        // Cleanup on unmount
        return () => {
            subscription.remove();
            NativePasteInputModule.unregisterTextInput(nativeID);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps - only run on mount/unmount

    // Update config if props change
    useEffect(() => {
        if (nativeIDRef.current) {
            NativePasteInputModule.registerTextInput(nativeIDRef.current, {
                disableCopyPaste,
                smartPunctuation,
            });
        }
    }, [disableCopyPaste, smartPunctuation]);

    return <TextInput ref={textInputRef} {...textInputProps} />;
}

function PasteInputAndroidComponent(
    props: PasteInputProps,
    forwardedRef: React.ForwardedRef<PasteTextInputInstance>
) {
    const { onPaste, ...pasteTextInputProps } = props;

    const pasteTextInputRef = useRef<PasteTextInputInstance>(null);

    // Expose the PasteTextInput ref to parent components (same as iOS)
    useImperativeHandle(forwardedRef, () => {
        if (pasteTextInputRef.current) {
            return pasteTextInputRef.current;
        }
        // Return a no-op implementation if ref is not yet available
        return {
            clear: () => {},
            isFocused: () => false,
            setSelection: () => {},
        } as unknown as PasteTextInputInstance;
    }, []);

    // For Android, PasteTextInput already handles everything internally
    // Just need to adapt the onPaste callback format
    const handlePaste = (error: string | null, files: PastedFile[]) => {
        if (onPaste) {
            onPaste(error, files);
        }
    };

    return (
        <PasteTextInput
            ref={pasteTextInputRef}
            {...pasteTextInputProps}
            onPaste={handlePaste}
        />
    );
}

const PasteInputComponent =
    Platform.OS === 'ios' ? PasteInputIOSComponent : PasteInputAndroidComponent;

export default forwardRef(PasteInputComponent);
