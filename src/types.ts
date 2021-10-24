import type { TextInputProps } from 'react-native';

export interface PastedFile {
    fileName: string;
    fileSize: number;
    type: string;
    uri: string;
}

export interface PasteEvent {
    nativeEvent: {
        data: Array<PastedFile>;
        error?: {
            message: string;
        };
    };
}

export interface PasteInputProps extends TextInputProps {
    disableCopyPaste?: boolean;
    onPaste(error: string | null | undefined, files: Array<PastedFile>): void;
}

export interface RCTPasteInputProps extends TextInputProps {
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

export interface TextInputNativeCommands {
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

export interface Selection {
    start: number;
    end?: number | undefined;
}
