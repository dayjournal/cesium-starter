const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './_resouce/main.js',
    output: {
        path: __dirname + '/dist',
        filename: 'app.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: './dist/img/icon/[name].[ext]',
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            Cesium: 'cesium',
        }),
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify(''),
        }),
        new CopyPlugin({
            patterns: [
                { from: './node_modules/cesium/Source/Assets', to: 'Assets' },
                { from: './node_modules/cesium/Source/Widgets', to: 'Widgets' },
                { from: './node_modules/cesium/Build/Cesium/Workers', to: 'Workers' },
            ],
        }),
    ],
    devServer: {
        contentBase: __dirname + '/dist',
        publicPath: '/',
        watchContentBase: true,
        open: true,
    },
};
