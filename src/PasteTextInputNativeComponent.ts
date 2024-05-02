import { type HostComponent, type ViewProps } from 'react-native';
import type {
    BubblingEventHandler,
    DirectEventHandler,
    Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

export interface PasteTextInputPasteEventData {
    data: {
        fileName: string;
        fileSize: Int32;
        type: string;
        uri: string;
    }[];
    error?: {
        message: string;
    };
}

export interface TargetedEvent {
    target: Int32;
}

export interface PasteTextInputContentSizeChangeEventData
    extends TargetedEvent {
    contentSize: {
        width: Int32;
        height: Int32;
    };
}

export interface PasteTextInputSelectionChangeEventData extends TargetedEvent {
    selection: {
        start: Int32;
        end: Int32;
    };
}

export interface PasteTextInputScrollEventData extends TargetedEvent {
    contentOffset: { x: Int32; y: Int32 };
}

export interface PasteTextInputChangeEventData {
    eventCount: Int32;
    text: string;
}

export interface PasteTextInputTextInputEventData {
    text: string;
    previousText: string;
    range: { start: Int32; end: Int32 };
}

export interface NativeProps extends ViewProps {
    autoCapitalize?: string;
    autoCorrect?: boolean;
    autoFocus?: boolean;
    caretHidden?: boolean;
    clearButtonMode?: string;
    clearTextOnFocus?: boolean;
    contextMenuHidden?: boolean;
    disableCopyPaste?: boolean;
    editable?: boolean;
    enablesReturnKeyAutomatically?: boolean;
    inputAccessoryViewID?: string;
    keyboardAppearance?: string;
    keyboardType?: string;
    maxLength?: Int32;
    mostRecentEventCount?: Int32;
    multiline?: boolean;
    passwordRules?: string;
    placeholder?: string;
    placeholderTextColor?: string;
    returnKeyType?: string;
    scrollEnabled?: boolean;
    secureTextEntry?: boolean;
    selection: { start: Int32; end?: Int32 };
    selectionColor?: string;
    selectTextOnFocus?: boolean;
    showSoftInputOnFocus?: boolean;
    smartInsertDelete?: boolean;
    smartPunctuation?: string;
    spellCheck?: boolean;
    submitBehavior?: string;
    text?: string;
    textContentType?: string;

    onChange?: BubblingEventHandler<PasteTextInputChangeEventData>;
    onPaste?: BubblingEventHandler<PasteTextInputPasteEventData>;

    onContentSizeChange?: DirectEventHandler<PasteTextInputContentSizeChangeEventData>;
    onScroll?: DirectEventHandler<PasteTextInputScrollEventData>;
    onSelectionChange?: BubblingEventHandler<PasteTextInputSelectionChangeEventData>;
    onTextInput?: DirectEventHandler<PasteTextInputTextInputEventData>;
}

type PasteTextInputNativeComponentType = HostComponent<NativeProps>;

interface NativeCommands {
    readonly focus: (
        viewRef: React.ElementRef<PasteTextInputNativeComponentType>
    ) => void;
    readonly blur: (
        viewRef: React.ElementRef<PasteTextInputNativeComponentType>
    ) => void;
    readonly setTextAndSelection: (
        viewRef: React.ElementRef<PasteTextInputNativeComponentType>,
        mostRecentEventCount: Int32,
        value: string | null | undefined, // in theory this is nullable
        start: Int32,
        end: Int32
    ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
    supportedCommands: ['focus', 'blur', 'setTextAndSelection'],
});

export default codegenNativeComponent<NativeProps>(
    'PasteTextInput'
) as HostComponent<NativeProps>;
