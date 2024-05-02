import type React from 'react';
import { Platform } from 'react-native';
import type { PasteInputProps } from './types';

export * from './types';

let PasteInput: React.ForwardRefExoticComponent<
    PasteInputProps & React.RefAttributes<unknown>
>;

if (Platform.OS === 'android') {
    PasteInput = require('./android');
} else {
    PasteInput = require('./PasteTextInput').default;
}

export default PasteInput;
