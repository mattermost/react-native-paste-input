import {
    type ColorValue,
    type HostComponent,
    type ViewProps,
} from 'react-native';
import type {
    BubblingEventHandler,
    DirectEventHandler,
    Double,
    Float,
    Int32,
    WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

export interface PasteTextInputPasteEventData {
    data: Readonly<
        {
            fileName: string;
            fileSize: Int32;
            type: string;
            uri: string;
        }[]
    >;
    error?: Readonly<{
        message: string;
    }>;
}

export type TargetedEvent = {
    target: Int32;
};

export interface PasteTextInputContentSizeChangeEventData
    extends TargetedEvent {
    contentSize: {
        width: Int32;
        height: Int32;
    };
}

export interface PasteTextInputSelectionChangeEventData extends TargetedEvent {
    selection: Readonly<{
        start: Int32;
        end: Int32;
    }>;
}

export interface PasteTextInputScrollEventData extends TargetedEvent {
    contentInset: Readonly<{
        top: Double;
        bottom: Double;
        left: Double;
        right: Double;
    }>;
    contentOffset: Readonly<{ x: Double; y: Double }>;
    contentSize: Readonly<{
        width: Double;
        height: Double;
    }>;
    layoutMeasurement: Readonly<{
        width: Double;
        height: Double;
    }>;
    responderIgnoreScroll: boolean;
    velocity: Readonly<{ x: Double; y: Double }>;
}

export interface PasteTextInputChangeEventData extends TargetedEvent {
    eventCount: Int32;
    text: string;
}

export interface PasteTextInputTextInputEventData extends TargetedEvent {
    text: string;
    previousText: string;
    range: Readonly<{ start: Int32; end: Int32 }>;
}

export interface PasteTextInputEditEventData extends TargetedEvent {
    text: string;
}

export interface PasteTextInputKeyEventData extends TargetedEvent {
    key: string;
}

type KeyboardType =
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad'
    | 'decimal-pad'
    | 'url'
    // iOS-only
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'name-phone-pad'
    | 'twitter'
    | 'web-search'
    // Android-only
    | 'visible-password';

export type ReturnKeyType =
    // Cross Platform
    | 'done'
    | 'go'
    | 'next'
    | 'search'
    | 'send'
    // Android-only
    | 'none'
    | 'previous'
    // iOS-only
    | 'default'
    | 'emergency-call'
    | 'google'
    | 'join'
    | 'route'
    | 'yahoo';

export type Autocomplete =
    | 'birthdate-day'
    | 'birthdate-full'
    | 'birthdate-month'
    | 'birthdate-year'
    | 'cc-csc'
    | 'cc-exp'
    | 'cc-exp-day'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-number'
    | 'email'
    | 'gender'
    | 'name'
    | 'name-family'
    | 'name-given'
    | 'name-middle'
    | 'name-middle-initial'
    | 'name-prefix'
    | 'name-suffix'
    | 'password'
    | 'password-new'
    | 'postal-address'
    | 'postal-address-country'
    | 'postal-address-extended'
    | 'postal-address-extended-postal-code'
    | 'postal-address-locality'
    | 'postal-address-region'
    | 'postal-code'
    | 'street-address'
    | 'sms-otp'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'tel-device'
    | 'username'
    | 'username-new'
    | 'off';

type SubmitBehavior = 'submit' | 'blurAndSubmit' | 'newline';

export interface NativeProps extends ViewProps {
    allowFontScaling?: boolean;
    autoCapitalize?: WithDefault<
        'none' | 'sentences' | 'words' | 'characters',
        'none'
    >;
    autoComplete?: WithDefault<Autocomplete, 'off'>;
    autoCorrect?: boolean;
    autoFocus?: boolean;
    blurOnSubmit?: boolean;
    caretHidden?: boolean;
    clearButtonMode?: string;
    clearTextOnFocus?: boolean;
    contextMenuHidden?: boolean;
    defaultValue?: string;
    disableCopyPaste?: boolean;
    disableFullscreenUI?: boolean;
    editable?: boolean;
    enablesReturnKeyAutomatically?: boolean;
    importantForAutofill?: string;
    inlineImageLeft?: string;
    inlineImagePadding?: Int32;
    inputAccessoryViewID?: string;
    keyboardAppearance?: string;
    keyboardType?: WithDefault<KeyboardType, 'default'>;
    maxFontSizeMultiplier?: Float;
    maxLength?: Int32;
    mostRecentEventCount?: Int32;
    multiline?: boolean;
    numberOfLines?: Int32;
    passwordRules?: string;
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    returnKeyLabel?: string;
    returnKeyType?: WithDefault<ReturnKeyType, 'done'>;
    scrollEnabled?: boolean;
    secureTextEntry?: boolean;
    selection?: Readonly<{ start: Int32; end?: Int32 }>;
    selectionColor?: ColorValue;
    selectionHandleColor?: ColorValue;
    selectTextOnFocus?: boolean;
    showSoftInputOnFocus?: boolean;
    smartInsertDelete?: boolean;
    smartPunctuation?: string;
    spellCheck?: boolean;
    submitBehavior?: WithDefault<SubmitBehavior, 'submit'>;

    text?: string;
    textBreakStrategy?: WithDefault<
        'simple' | 'highQuality' | 'balanced',
        'simple'
    >;
    textContentType?: string;
    underlineColorAndroid?: ColorValue;
    value?: string;

    onBlur?: BubblingEventHandler<TargetedEvent>;
    onChange?: BubblingEventHandler<PasteTextInputChangeEventData>;
    onChangeText?: BubblingEventHandler<PasteTextInputChangeEventData>;
    onEndEditing?: BubblingEventHandler<PasteTextInputEditEventData>;
    onFocus?: BubblingEventHandler<TargetedEvent>;
    onKeyPress?: BubblingEventHandler<PasteTextInputKeyEventData>;
    onPaste?: BubblingEventHandler<PasteTextInputPasteEventData>;
    onSubmitEdition?: BubblingEventHandler<PasteTextInputEditEventData>;

    onContentSizeChange?: DirectEventHandler<PasteTextInputContentSizeChangeEventData>;
    onScroll?: DirectEventHandler<PasteTextInputScrollEventData>;
    onSelectionChange?: DirectEventHandler<PasteTextInputSelectionChangeEventData>;

    textShadowColor?: ColorValue;
    textShadowRadius?: Float;
    textDecorationLine?: string;
    fontStyle?: string;
    textShadowOffset?: Readonly<{ width?: Double; height?: Double }>;
    lineHeight?: Float;
    textTransform?: string;
    color?: Int32;
    letterSpacing?: Float;
    fontSize?: Float;
    textAlign?: string;
    includeFontPadding?: boolean;
    fontWeight?: string;
    fontFamily?: string;

    textAlignVertical?: string;
    cursorColor?: ColorValue;
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
