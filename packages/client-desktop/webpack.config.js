const path = require('path');
const { merge } = require('webpack-merge');
const CopyPlugin = require("copy-webpack-plugin");

const baseConfig = {
    mode: 'development',
    entry: './src/electron.ts',
    target: 'electron-main',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [{
            test: /\.ts$/,
            include: /src/,
            exclude: /node_modules/,
            use: [
                { loader: 'ts-loader' }
            ]
        }]
    },
    output: {
        path: __dirname + '/src',
        filename: 'electron.js'
    },
};
module.exports = [
    merge(baseConfig, {
        entry: './src/main/main.ts',
        target: 'electron-main',
        name: "main",
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist/main'),
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "./node_modules/@manniwatch/client-ng/dist/manniwatch/"),
                        to: path.resolve(__dirname, "./dist/static")
                    },
                ],
            }),
        ], node: {
            __dirname: false
        }, externals: {
            '@manniwatch/api-client': 'commonjs @manniwatch/api-client',
            'axios': 'commonjs axios',
            'commander': 'commonjs commander',
        },
        //devtool: 'inline-source-map',
    }),
    merge(baseConfig, {
        entry: './src/preload/prerender.ts',
        target: 'electron-preload',
        name: "preload",
        //externals: ['electron', 'electron/renderer'],
        output: {
            filename: 'prerender.js',
            path: path.resolve(__dirname, 'dist/preload'),
        },
        //devtool: 'inline-source-map',
    }),
];
