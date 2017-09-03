"use strict";
exports.__esModule = true;
//Webpack
let webpack = require("webpack");
let LiveReloadPlugin = require("webpack-livereload-plugin");
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let path = require("path");
let extractSass = new ExtractTextPlugin({
    filename: "styles/cyberian-[name].css",
    disable: process.env.NODE_ENV === "development"
});
function config(env) {

    let rules;
    let plugins;
    //DEVELOP
    if (env.develop) {
        rules = [
            {
                test: /\.scss$/,
                use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    },
                    {
                        loader: "resolve-url-loader" // compiles Sass to CSS
                    },
                    {
                        loader: "sass-loader" // compiles Sass to CSS
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            { test: /\.txt$/, use: 'raw-loader' },
            {
                test: require.resolve('jquery'),
                use: [{
                        loader: 'expose-loader',
                        options: '$'
                    }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                {
                    loader: 'url-loader',
                    options: {
                    limit: 8192
                    }
                }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                {
                    loader: 'url-loader',
                    options: {
                    limit: 8192
                    }
                }
                ]
            }
        ];

        plugins = [
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery'
            }),
            new webpack.ProvidePlugin({
                jdenticon: "jdenticon"
            }),
            new LiveReloadPlugin({})
        ]
    }
    //PRODUCTION
    else {
        rules = [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            { test: /\.txt$/, use: 'raw-loader' },
            {
                test: require.resolve('jquery'),
                use: [{
                        loader: 'expose-loader',
                        options: '$'
                    }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                {
                    loader: 'url-loader',
                    options: {
                    limit: 8192
                    }
                }
                ]
            }
        ];
        plugins = [
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery'
            }),
            new webpack.ProvidePlugin({
                jdenticon: "jdenticon"
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common'
            }),
            extractSass,
        ]
    }

    const config = {
        entry: {
            main: './app/index.ts',
            admin: './app/styles/admin.index.ts',
            front: './app/styles/front.index.ts'
        },
        output: {
            path: path.resolve(__dirname, 'server', 'public'),
            filename: 'scripts/cyberian-[name].bundle.js',
            library: "cyberian"
        },
        module: {
            rules: rules
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {}
        },
        plugins: plugins
    };

    return config;
}
module.exports = config;
