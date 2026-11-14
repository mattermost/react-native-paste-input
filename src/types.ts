import type { ComponentRef, ForwardedRef } from 'react';
import type { HostComponent, TextInputProps } from 'react-native';

type HostInstance = ComponentRef<HostComponent<PasteInputProps>>;

export type PasteTextInputInstance = HostInstance & {
    clear: () => void;
    isFocused: () => boolean;
    getNativeRef?: () => HostInstance;
    setSelection: (start: number, end: number) => void;
};

export interface PastedFile {
    fileName: string;
    fileSize: number;
    type: string;
    uri: string;
}

export interface PasteEvent {
    nativeEvent: {
        data: PastedFile[];
        error?: {
            message: string;
        };
    };
}

/**
 * Smart punctuation settings for iOS
 */
export type SmartPunctuation = 'default' | 'enable' | 'disable';

/**
 * Props for the PasteInput component
 * Extends all standard TextInput props
 */
export interface PasteInputProps extends Omit<TextInputProps, 'forwardedRef'> {
    forwardedRef?: ForwardedRef<PasteTextInputInstance>;
    /**
     * Maps to numberOfLines on Android. Mirrors the HTML rows attribute.
     */
    rows?: number;
    /**
     * Disable copy, cut, and paste actions
     */
    disableCopyPaste?: boolean;

    /**
     * Configure smart punctuation (iOS only)
     */
    smartPunctuation?: SmartPunctuation;

    /**
     * Callback when files are pasted
     * @param error - Error message if paste failed, null otherwise
     * @param files - Array of pasted files
     */
    onPaste?(error: string | null | undefined, files: Array<PastedFile>): void;
}

export interface Selection {
    start: number;
    end?: number | undefined;
}

export type SubmitBehavior = 'submit' | 'blurAndSubmit' | 'newline';
