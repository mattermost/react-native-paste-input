import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Button,
    Appearance,
    Text,
    TextInput,
} from 'react-native';
import PasteInput, {
    type PastedFile,
    type PasteInputRef,
} from '@mattermost/react-native-paste-input';

import Details from './Details';

export default function App() {
    const inputRef = useRef<PasteInputRef>(null);
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
        <View style={styles.container}>
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
                >
                    <Text>
                        Test? pwaojefpawjga woejg pawjge pjwegp wjegp jwepaowegj
                        pgjeopgjaweog{' '}
                    </Text>
                    <Text>
                        Test? ajwegpoawegp jawpogh pdhgpawofodfj ewpgh wegpweg d
                        do eogewge
                    </Text>
                    <Text>Test? agpoweajg padf pdf fpweapgaweg pwag aweg</Text>
                </PasteInput>
            )}
            <TextInput
                style={[{ color }, styles.input]}
                multiline={true}
                placeholder="This is a Normal Input"
                submitBehavior="newline"
                underlineColorAndroid="transparent"
                keyboardType="default"
                disableFullscreenUI={true}
                textContentType="none"
                autoComplete="off"
            />
            <Button
                title={inputVisible ? 'Hide Input' : 'Show Input'}
                onPress={toggleInputVisibility}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
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
        width: '90%',
    },
});
