const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');


module.exports = {
    mode: 'development',

    context: path.resolve(__dirname, 'src'),

    entry: {
        // bundle: './client/index.js',
        main: './server/public/js'
    },

    output: {
        publicPath: '/',
        path: path.resolve(__dirname, 'dist/static'),
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css/,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader'
                ]
            },
            {
                test: /\.scss/,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'
                ]
            }
        ],
    },

    resolve: {
        alias: {
            'ignore-styles': './webpack/alias/ignore-styles.js'
        }
    },

    plugins: [
        new TerserPlugin(),
        new MiniCssExtractPlugin({
            filename: 'styles.css' 
        }),
        new webpack.IgnorePlugin(/ignore-styles/),
    ],

    devtool: 'inline-source-map',

    externals: {
        EcwidApp: "EcwidApp",
        checkFieldChange: "checkFieldChange"
    }
};
