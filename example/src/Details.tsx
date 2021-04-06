import React from 'react';
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native';
import type { PastedFile } from '@mattermost/react-native-paste-input';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface DetailsProps {
    file?: PastedFile;
}

const getStyle = (isDarkMode: boolean) => {
    return StyleSheet.create({
        container: {
            justifyContent: 'center',
        },
        image: {
            width: 300,
            height: 300,
        },
        imageContainer: {
            alignItems: 'center',
            marginBottom: 10,
        },
        infoContainer: {
            paddingHorizontal: 16,
            width: '90%',
        },
        info: {
            flexDirection: 'row',
        },
        label: {
            color: isDarkMode ? Colors.white : Colors.black,
            fontSize: 16,
            lineHeight: 18,
            fontWeight: '700',
            marginRight: 5,
        },
        text: {
            color: isDarkMode ? Colors.white : Colors.black,
            fontSize: 14,
            lineHeight: 16,
            flexWrap: 'wrap',
            width: '90%',
        },
    });
};

const Details = ({ file }: DetailsProps) => {
    const isDarkMode = useColorScheme() === 'dark';

    if (!file) {
        return null;
    }

    const styles = getStyle(isDarkMode);
    const isImage = file.type.includes('image');
    let imageElement;
    if (isImage) {
        imageElement = (
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: file.uri }} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {imageElement}
            <View style={styles.infoContainer}>
                <View style={styles.info}>
                    <Text style={styles.label}>{'File name:'}</Text>
                    <Text style={styles.text}>{file.fileName}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.label}>{'File size:'}</Text>
                    <Text style={styles.text}>{file.fileSize}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.label}>{'File type:'}</Text>
                    <Text style={styles.text}>{file.type}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.label}>{'Uri:'}</Text>
                    <Text style={styles.text}>{file.uri}</Text>
                </View>
            </View>
        </View>
    );
};

export default Details;
