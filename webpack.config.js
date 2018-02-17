'use strict';

//анализ логов: http://webpack.github.io/analyse/

const CTmpEntries = require('./CTmpEntries');
const CFileLoaderName = require('./CFileLoaderName');
const path = require('path');
const srcPath = require('./GetSrcPath');

const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const ENV = process.env.NODE_ENV || 'development';

let isDev;
let needWatch;

switch(ENV){
    case 'development':
        isDev     = true;
        needWatch = false;
        break;

    case 'development-watch':
        isDev     = true;
        needWatch = true;
        break;

    case 'production':
        isDev     = false;
        needWatch = false;
        break;

    default:
        throw new Error('Неизвестный тип сборки');
}

let config = {
    context: __dirname + '/../src/resources/assets',

    entry: CTmpEntries.GetTmpEntriesList(),

    output: {
        path: path.join(srcPath, 'public'),
        filename: 'assets/js/[name].js',
    },

    watch: needWatch,

    devtool: 'source-map',

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
        }),
        new webpack.ProvidePlugin(CTmpEntries.GetProvidedVariables()),
        new ExtractTextPlugin('/assets/css/[name].css'),
        new CopyWebpackPlugin([{from: './img', to: './assets/img'}])
    ],

    module: {
        loaders: [
            //0
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            //1
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("css-loader?&sourceMap=true!less-loader?sourceMap=true")
            },
            //2
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract("css-loader?&sourceMap=true")
            },
            //3
            {
                test: /\.(png|jpg|svg|gif|ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: CFileLoaderName.GetNameFromPath
                }
            }
        ]
    },

    resolve: {
        modules: [
            path.join(__dirname, 'node_modules')
        ]
    }
};

if (!isDev) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true,
            },
            sourceMap: true
        })
    );

    config.module.loaders[1].loader = ExtractTextPlugin.extract("css-loader?minimize=true&sourceMap=true!less-loader?sourceMap=true");
    config.module.loaders[2].loader = ExtractTextPlugin.extract("css-loader?minimize=true&sourceMap=true");
}
else {
    config.module.loaders[1].loader = ExtractTextPlugin.extract("css-loader?&sourceMap=true!less-loader?sourceMap=true");
    config.module.loaders[2].loader = ExtractTextPlugin.extract("css-loader?&sourceMap=true");
}

module.exports = config;