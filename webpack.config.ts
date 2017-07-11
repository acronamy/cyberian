//Webpack
import * as webpack from "webpack";
import * as LiveReloadPlugin from "webpack-livereload-plugin"
import * as WebpackPreBuildPlugin from "pre-build-webpack";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";

//Post css
import { postCSSConfig } from "./postcss.config";

//Node
import * as child from "child_process";
import * as os from "os";
import * as path from "path";

const extractSass = new ExtractTextPlugin({
    filename: "styles/cyberian-[name].css",
    
    disable: process.env.NODE_ENV === "development"
});

function startServer(){
    //not using dev server as express is also being developed.
    let server;
    process.env.TS_NODE_PROJECT = path.join(process.cwd(),"tsconfig.json")
    console.log("tsconfig:", process.env.TS_NODE_PROJECT)

    if(os.platform() === "linux"){
        server = child.spawn('bash', ['-c','ts-node','./server/index.ts']);
    }
    else{
        server = child.spawn('cmd', ['/c','ts-node','./server/index.ts']);
    }

    server.stdout.on('data', data => {
        console.log(`server: ${data}`);
    });
    server.stderr.on('data', data => {
        console.log(`server: ${data}`);
    });
    server.on('close', code => {
        console.log(`server exited with code ${code}`);
    });

    process.on("exit", ()=> {
        //webpack.kill();
        server.kill();
    })
}

const config = {
    entry: {
        main:'./app/index.ts',
        admin:'./app/styles/admin.index.ts',
        front:'./app/styles/front.index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'server', 'public'),
        filename: 'scripts/cyberian-[name].bundle.js',
        library: "cyberian"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use:[
                        {
                            loader: "css-loader"
                        },
                        {
                            loader: "sass-loader",
                            options:{
                                sourceMap:true,
                            }
                        }
                    ],
                    fallback:"style-loader"
                })
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            { test: /\.txt$/, use: 'raw-loader' },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$'
                }]
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias:{
            
        }
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

        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common', // Specify the common bundle's name.
        }),
        extractSass,
        new WebpackPreBuildPlugin(startServer),
    ]
};

module.exports = config;