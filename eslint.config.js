const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
    {
        ignores: ['node_modules/**', 'lib/**'],
    },
    {
        files: ['**/*.{js,ts,tsx}'],
        plugins: {
            '@typescript-eslint': tseslint,
            'prettier': prettierPlugin,
        },
        languageOptions: {
            parser: tsparser,
            globals: {
                __DEV__: true,
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...prettierConfig.rules,
            ...prettierPlugin.configs.recommended.rules,
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
            'no-undef': 'off',
            'no-shadow': 'off',
            'no-use-before-define': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                },
            ],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-shadow': 1,
        },
    },
];
