import {
    type CodegenTypes,
    type ColorValue,
    type HostComponent,
    type ViewProps,
} from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

export type TargetedEvent = {
    target: CodegenTypes.Int32;
};

export interface PasteTextInputPasteEventData extends TargetedEvent {
    data: Readonly<
        {
            fileName: string;
            fileSize: CodegenTypes.Int32;
            type: string;
            uri: string;
        }[]
    >;
    error?: Readonly<{
        message: string;
    }>;
}

export interface PasteTextInputContentSizeChangeEventData extends TargetedEvent {
    contentSize: {
        width: CodegenTypes.Double;
        height: CodegenTypes.Double;
    };
}

export interface PasteTextInputSelectionChangeEventData extends TargetedEvent {
    selection: Readonly<{
        start: CodegenTypes.Int32;
        end: CodegenTypes.Int32;
    }>;
}

export interface PasteTextInputScrollEventData extends TargetedEvent {
    contentInset: Readonly<{
        top: CodegenTypes.Double;
        bottom: CodegenTypes.Double;
        left: CodegenTypes.Double;
        right: CodegenTypes.Double;
    }>;
    contentOffset: Readonly<{ x: CodegenTypes.Double; y: CodegenTypes.Double }>;
    contentSize: Readonly<{
        width: CodegenTypes.Double;
        height: CodegenTypes.Double;
    }>;
    layoutMeasurement: Readonly<{
        width: CodegenTypes.Double;
        height: CodegenTypes.Double;
    }>;
    responderIgnoreScroll: boolean;
    velocity: Readonly<{ x: CodegenTypes.Double; y: CodegenTypes.Double }>;
}

export interface PasteTextInputChangeEventData extends TargetedEvent {
    eventCount: CodegenTypes.Int32;
    text: string;
}

export interface PasteTextInputTextInputEventData extends TargetedEvent {
    text: string;
    previousText: string;
    range: Readonly<{ start: CodegenTypes.Int32; end: CodegenTypes.Int32 }>;
}

export interface PasteTextInputEditEventData extends TargetedEvent {
    text: string;
    eventCount: CodegenTypes.Int32;
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
    autoCapitalize?: CodegenTypes.WithDefault<
        'none' | 'sentences' | 'words' | 'characters',
        'none'
    >;
    autoComplete?: CodegenTypes.WithDefault<Autocomplete, 'off'>;
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
    inlineImagePadding?: CodegenTypes.Int32;
    inputAccessoryViewID?: string;
    keyboardAppearance?: string;
    keyboardType?: CodegenTypes.WithDefault<KeyboardType, 'default'>;
    maxFontSizeMultiplier?: CodegenTypes.Float;
    maxLength?: CodegenTypes.Int32;
    mostRecentEventCount?: CodegenTypes.Int32;
    multiline?: boolean;
    numberOfLines?: CodegenTypes.Int32;
    passwordRules?: string;
    placeholder?: string;
    placeholderTextColor?: ColorValue;
    returnKeyLabel?: string;
    returnKeyType?: CodegenTypes.WithDefault<ReturnKeyType, 'done'>;
    scrollEnabled?: boolean;
    secureTextEntry?: boolean;
    selectionColor?: ColorValue;
    selectionHandleColor?: ColorValue;
    selectTextOnFocus?: boolean;
    showSoftInputOnFocus?: boolean;
    smartInsertDelete?: boolean;
    smartPunctuation?: string;
    spellCheck?: boolean;
    submitBehavior?: CodegenTypes.WithDefault<SubmitBehavior, 'submit'>;

    text?: string;
    textBreakStrategy?: CodegenTypes.WithDefault<
        'simple' | 'highQuality' | 'balanced',
        'simple'
    >;
    textContentType?: string;
    underlineColorAndroid?: ColorValue;
    value?: string;

    onBlur?: CodegenTypes.BubblingEventHandler<TargetedEvent>;
    onChange?: CodegenTypes.BubblingEventHandler<PasteTextInputChangeEventData>;
    onChangeText?: CodegenTypes.BubblingEventHandler<PasteTextInputChangeEventData>;
    onEndEditing?: CodegenTypes.BubblingEventHandler<PasteTextInputEditEventData>;
    onFocus?: CodegenTypes.BubblingEventHandler<TargetedEvent>;
    onKeyPress?: CodegenTypes.BubblingEventHandler<PasteTextInputKeyEventData>;
    onPaste?: CodegenTypes.BubblingEventHandler<PasteTextInputPasteEventData>;
    onSubmitEditing?: CodegenTypes.BubblingEventHandler<PasteTextInputEditEventData>;

    onContentSizeChange?: CodegenTypes.DirectEventHandler<PasteTextInputContentSizeChangeEventData>;
    onScroll?: CodegenTypes.DirectEventHandler<PasteTextInputScrollEventData>;
    onSelectionChange?: CodegenTypes.DirectEventHandler<PasteTextInputSelectionChangeEventData>;

    textShadowColor?: ColorValue;
    textShadowRadius?: CodegenTypes.Float;
    textDecorationLine?: string;
    fontStyle?: string;
    textShadowOffset?: Readonly<{
        width?: CodegenTypes.Double;
        height?: CodegenTypes.Double;
    }>;
    lineHeight?: CodegenTypes.Float;
    textTransform?: string;
    color?: CodegenTypes.Int32;
    letterSpacing?: CodegenTypes.Float;
    fontSize?: CodegenTypes.Float;
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
        mostRecentEventCount: CodegenTypes.Int32,
        value: string | null | undefined, // in theory this is nullable
        start: CodegenTypes.Int32,
        end: CodegenTypes.Int32
    ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
    supportedCommands: ['focus', 'blur', 'setTextAndSelection'],
});

export default codegenNativeComponent<NativeProps>(
    'PasteTextInput'
) as HostComponent<NativeProps>;
