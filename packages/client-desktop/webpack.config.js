const path = require('path');
const { merge } = require('webpack-merge');

const baseConfig = {
    mode: 'development',
    entry: './src/electron.ts',
    target: 'electron-main',
    mode: 'development',
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
    }, node: {
        __dirname: true
    },
};
module.exports = [
    merge(baseConfig, {
        entry: './src/main/main.ts',
        target: 'electron-main',
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'dist/main'),
        },
        //devtool: 'inline-source-map',
    }),
    merge(baseConfig, {
        entry: './src/preload/prerender.ts',
        target: 'electron-preload',
        //externals: ['electron', 'electron/renderer'],
        output: {
            filename: 'prerender.js',
            path: path.resolve(__dirname, 'dist/preload'),
        },
        //devtool: 'inline-source-map',
    })
];
