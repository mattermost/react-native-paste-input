import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Button, Appearance } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {
    KeyboardAwareScrollView,
    KeyboardProvider,
} from 'react-native-keyboard-controller';
import PasteInput, {
    type PastedFile,
    type PasteTextInputInstance,
} from '@mattermost/react-native-paste-input';

import Details from './Details';

export default function App() {
    const inputRef = useRef<PasteTextInputInstance>(null);
    const [file, setFile] = useState<PastedFile>();
    const [inputVisible, setInputVisible] = useState<boolean>(true);
    const [color, setColor] = useState(
        Appearance.getColorScheme() === 'light' ? 'black' : 'white'
    );

    const onPaste = (
        error: string | null | undefined,
        files: Array<PastedFile>
    ) => {
        console.log('ERROR', error);
        console.log('PASTED FILES', files);
        if (!error) {
            setFile(files[0]);
        }
    };

    const toggleInputVisibility = () => {
        setInputVisible(!inputVisible);
    };

    useEffect(() => {
        const listener = Appearance.addChangeListener((preferences) => {
            setColor(preferences.colorScheme === 'light' ? 'black' : 'white');
        });

        return () => listener.remove();
    }, []);

    useLayoutEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <SafeAreaProvider>
            <KeyboardProvider>
                <SafeAreaView style={styles.safeArea}>
                    <KeyboardAwareScrollView
                        keyboardDismissMode="interactive"
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.container}
                        disableScrollOnKeyboardHide={true}
                    >
                        <Details file={file} />
                        {inputVisible && (
                            <PasteInput
                                ref={inputRef}
                                disableCopyPaste={false}
                                onPaste={onPaste}
                                style={[{ color }, styles.input]}
                                multiline={true}
                                placeholder="This is a PasteInput"
                                submitBehavior="newline"
                                underlineColorAndroid="transparent"
                                keyboardType="default"
                                disableFullscreenUI={true}
                                textContentType="none"
                                autoComplete="off"
                                smartPunctuation="disable"
                            />
                        )}
                        <Button
                            title={inputVisible ? 'Hide Input' : 'Show Input'}
                            onPress={toggleInputVisibility}
                        />
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </KeyboardProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        fontSize: 15,
        lineHeight: 20,
        paddingHorizontal: 12,
        paddingTop: Platform.select({
            ios: 6,
            android: 8,
        }),
        paddingBottom: Platform.select({
            ios: 6,
            android: 2,
        }),
        minHeight: 30,
        maxHeight: 150,
        borderColor: 'gray',
        borderWidth: 1,
        width: '95%',
    },
});
