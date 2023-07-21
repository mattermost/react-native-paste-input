import React, { useRef, useState } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Button,
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
    const [focused, setFocused] = useState(false);

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

    // React.useEffect(() => {
    //     requestAnimationFrame(() => {
    //         inputRef.current?.focus();
    //     });
    // }, [inputRef]);

    return (
        <View style={styles.container}>
            <Details file={file} />
            <TextInput style={styles.input} placeholder="This is a TextInput" />
            {inputVisible && (
                <PasteInput
                    ref={inputRef}
                    disableCopyPaste={false}
                    onPaste={onPaste}
                    style={styles.input}
                    multiline={true}
                    placeholder="This is a PasteInput"
                    submitBehavior="newline"
                    underlineColorAndroid="transparent"
                    keyboardType="default"
                    disableFullscreenUI={true}
                    textContentType="none"
                    autoComplete="off"
                    smartPunctuation="disable"
                    onBlur={() => {
                        setFocused(false);
                    }}
                    onFocus={() => {
                        setFocused(true);
                    }}
                />
            )}
            <Button
                title={inputVisible ? 'Hide Input' : 'Show Input'}
                onPress={toggleInputVisibility}
            />

            <Text>Is PasteInput focused: {String(focused)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
        width: '90%',
    },
});
