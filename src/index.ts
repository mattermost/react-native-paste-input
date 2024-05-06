import type React from 'react';
// import { Platform } from 'react-native';
import type { PasteInputProps } from './types';

export * from './types';

let PasteInput: React.ForwardRefExoticComponent<
    PasteInputProps & React.RefAttributes<unknown>
>;

PasteInput = require('./PasteTextInput').default;

export default PasteInput;
