import * as path from "path";
import * as webpack from "webpack";
import * as LiveReloadPlugin from "webpack-livereload-plugin"

const config = {
    entry: './app/index.ts',
    output: {
        path: path.resolve(__dirname, 'server', 'public', 'scripts'),
        filename: 'admin.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            { test: /\.txt$/, use: 'raw-loader' }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    plugins: [
        new webpack.ProvidePlugin({   
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        new webpack.ProvidePlugin({   
            jdenticon: "jdenticon"
        }),
        new LiveReloadPlugin({

        })
    ]
};

module.exports = config;