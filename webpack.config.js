// docs: http://webpack.github.io/docs/configuration.html
'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const entry = ['whatwg-fetch', './src/index'];
const plugins = [
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
    }),
];

if (process.env.NODE_ENV === 'development') {
    entry.push('webpack-dev-server/client?http://localhost:3000');
    entry.push('webpack/hot/only-dev-server');
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
    entry,

    resolve: {
        root: [path.join(__dirname, 'src')],
        extensions: ['', '.scss', '.css', '.js', '.jsx', '.json'],
    },

    output: {
        path: path.join(__dirname, 'dist/public'),
        filename: 'bundle.js',
        publicPath: '/static/',
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                include: path.join(__dirname, 'src'),
            },
            {
                test: /(\.scss)$/,
                loader: ExtractTextPlugin.extract('style',
                    'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass'),
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css'),
            },
        ],
    },

    plugins,

    sassLoader: {
        // data: '@import "theme/_config.scss";',
        includePaths: [path.resolve(__dirname, './src')],
    },

    devtool: 'source-map',

    externals: {
        // stuff not in node_modules can be resolved here.
    },

    devServer: {
        proxy: {
            '/api': {
                target: process.env.UNLEASH_API || 'http://localhost:4242',
                changeOrigin: true,
                secure: false,
            },
        },
        port: process.env.PORT || 3000,
    },
};
