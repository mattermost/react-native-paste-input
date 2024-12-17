module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['@react-native', 'prettier'],
    plugins: ['eslint-plugin-prettier'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                quoteProps: 'consistent',
                singleQuote: true,
                tabWidth: 4,
                trailingComma: 'es5',
                useTabs: false,
            },
        ],
    },
    ignorePatterns: ['node_modules/', 'lib/'],
};
