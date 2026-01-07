import type { ForwardedRef } from 'react';
import type { HostComponent, TextInputProps } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export type PasteTextInputInstance = React.ElementRef<
    HostComponent<PasteInputProps>
> & {
    clear: () => void;
    isFocused: () => boolean;
    getNativeRef?: () => React.ElementRef<HostComponent<PasteInputProps>>;
    setSelection: (start: number, end: number) => void;
};

export interface PastedFile {
    fileName: string;
    fileSize: Int32;
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
export interface PasteInputProps extends TextInputProps {
    forwardedRef?: ForwardedRef<PasteTextInputInstance>;
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
    onPaste(error: string | null | undefined, files: Array<PastedFile>): void;
}

export interface Selection {
    start: number;
    end?: number | undefined;
}

export type SubmitBehavior = 'submit' | 'blurAndSubmit' | 'newline';
