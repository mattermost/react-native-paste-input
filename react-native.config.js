/**
 * @type {import('@react-native-community/cli-types').UserDependencyConfig}
 */
module.exports = {
    dependency: {
        platforms: {
            android: {
                sourceDir: './android',
                cmakeListsPath: 'generated/jni/CMakeLists.txt',
            },
        },
    },
};
