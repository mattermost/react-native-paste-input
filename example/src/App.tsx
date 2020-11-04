import React, { useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import PasteInput, {
    PastedFile,
    PasteInputRef,
} from '@mattermost/react-native-paste-input';

import Details from './Details';

export default function App() {
    const inputRef = useRef<PasteInputRef>(null);
    const [file, setFile] = useState<PastedFile>();

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

    React.useEffect(() => {
        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });
    }, [inputRef]);

    return (
        <View style={styles.container}>
            <Details file={file} />
            <PasteInput
                ref={inputRef}
                disableCopyPaste={false}
                onPaste={onPaste}
                style={styles.input}
                multiline={true}
                blurOnSubmit={false}
                underlineColorAndroid="transparent"
                keyboardType="default"
                disableFullscreenUI={true}
                textContentType="none"
                autoCompleteType="off"
            />
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
