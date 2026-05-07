// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = Object.keys({
    ...pak.peerDependencies,
});

const config = {
    projectRoot: __dirname,
    watchFolders: [root],

    resolver: {
        // Redirect the library's package name to its TypeScript source directly,
        // so Metro uses src/ instead of the built lib/ output — no babel-plugin-module-resolver needed.
        resolveRequest: (context, moduleName, platform) => {
            if (moduleName === pak.name) {
                const base = path.join(root, pak.source);
                const extensions = ['.tsx', '.ts', '.jsx', '.js'];
                const filePath =
                    extensions
                        .map((ext) => base + ext)
                        .find((f) => fs.existsSync(f)) ?? base;
                return { filePath, type: 'sourceFile' };
            }
            return context.resolveRequest(context, moduleName, platform);
        },

        // We need to make sure that only one version is loaded for peerDependencies
        // So we block them at the root, and alias them to the versions in example's node_modules
        blockList: new RegExp(
            modules
                .map(
                    (m) =>
                        `^${path.join(root, 'node_modules', m).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')}\\/.*$`
                )
                .join('|')
        ),

        extraNodeModules: modules.reduce((acc, name) => {
            acc[name] = path.join(__dirname, 'node_modules', name);
            return acc;
        }, {}),
    },
};

module.exports = mergeConfig(getDefaultConfig(root), config);
