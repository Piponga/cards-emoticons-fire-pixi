const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const requireJSON5 = require('require-json5');

// Preparing assets to copy. Adding only used
const assets = require('./src/assets.js');
const copyAssets = [];

for (let key in assets) {

    let type = assets[key].type;
    let url = assets[key].url;

    copyAssets.push({
        from: url,
        to: url
    });

    // Add atlas image to copy
    if (type === 'atlas') {

        const atlas = requireJSON5(url);
        const image = atlas && atlas.meta && atlas.meta.image;

        if (image) {

            url = url.replace(/[^/]+$/i, image);

            copyAssets.push({
                from: url,
                to: url
            });
        }
    }
}

const base = {
    entry: {
        main: path.resolve(__dirname, './src/index.js')
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            },
            {
                test: /\.(ico|png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new webpack.ProvidePlugin({
            _: 'underscore',
            PIXI: 'pixi.js',
            GSAP: ['gsap', 'gsap'],
        }),
        new CopyPlugin({
            patterns: copyAssets
        }),
    ]
};

const prod = {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                extractComments: false,
            })
        ]
    },
};

const dev = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './',
        open: true,
        compress: true,
        hot: true,
        port: 9080,
        host: "local-ip",
    }
};

module.exports = function (env) {
    return Object.assign(base, env.development ? dev : prod);
};
