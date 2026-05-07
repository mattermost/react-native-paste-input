/**
 * Native Module spec for PasteInput
 *
 * This TurboModule provides methods to register/unregister TextInput instances
 * for paste interception without replacing the entire TextInput component.
 */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface PasteInputConfig {
    disableCopyPaste?: boolean;
    smartPunctuation?: string; // 'default' | 'enable' | 'disable' (union types not supported in codegen)
}

export interface Spec extends TurboModule {
    /**
     * Register a TextInput for paste interception
     * @param nativeID - The nativeID string identifier for the view
     * @param config - Configuration for paste behavior
     */
    registerTextInput(nativeID: string, config: PasteInputConfig): void;

    /**
     * Unregister a TextInput (cleanup on unmount)
     * @param nativeID - The nativeID string identifier for the view
     */
    unregisterTextInput(nativeID: string): void;

    /**
     * Add event listener for paste events
     */
    addListener(eventName: string): void;

    /**
     * Remove event listeners
     */
    removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('PasteInputModule');
