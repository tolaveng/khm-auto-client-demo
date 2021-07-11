const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs'); // to check if the file exists


module.exports = (env, argv) => {

    //------ Configure .env.development -----
    // https://trekinbami.medium.com/using-environment-variables-in-react-6b0a99d83cf5
    // https://webpack.js.org/guides/environment-variables/

    // Get the root path (assuming your webpack config is in the root of your project!)
    const currentPath = path.join(__dirname);
    
    // Create the fallback path (the production .env)
    const basePath = currentPath + '\\src\\.env';

    // We're concatenating the environment name to our filename to specify the correct env file!
    const envPath = basePath + '.' + argv.mode;     //env
    
    // Check if the file exists, otherwise fall back to the production .env
    const finalPath = fs.existsSync(envPath) ? envPath : basePath;
    console.log('Env File Path: ' + finalPath);

    // Set the path parameter in the dotenv config
    const fileEnv = dotenv.config({ path: finalPath }).parsed;

    // reduce it to a nice object, the same as before (but with the variables from the file)
    const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
        return prev;
    }, {});

    //------ End Configure .env.development -----
    const buildPath = '/build'

    return {
        //mode: 'development',
        //entry: './src/index.tsx',
        entry: path.resolve(__dirname, 'src/index.tsx'),
        //target: 'electron-renderer',
        devtool: argv.mode && argv.mode == 'development' ? 'source-map' : false,
        devServer: {
            contentBase: path.join(__dirname, './build'),
            compress: argv.mode != 'development',
            hot: false,  /** hot for target: web */
            port: 9000,
            historyApiFallback: true,
            writeToDisk: false
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            mainFields: ['main', 'module', 'browser'],
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts|tsx)$/,
                    include: /src/,
                    exclude: /node_modules/,
                    use: [{ loader: 'babel-loader' }]
                },
                {
                    test: /\.html$/,
                    use: [{loader: "html-loader"}]
                },
                {
                    test: /\.(png|jp?g|gif)$/i,
                    use:[{loader: "file-loader"}]
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader', 'resolve-url-loader'],
                    include: [
                    path.join(__dirname, 'src'),
                    /node_modules/
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg)$/,
                    use:[{loader: "url-loader"}]
                }
            ]
        },
        output: {
            path: path.join(__dirname, buildPath), // absolute path: where to write bundle file to
            filename: 'bundle.js',
            //publicPath: './'                        // Electron: where to access from browser
            publicPath: '/build'                        // where to access from browser
        },
        plugins: [
            new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/favicon.ico'
            }),
            // read .env
            new webpack.DefinePlugin(envKeys),
            // new webpack.DefinePlugin({
            //     //'process.env': JSON.stringify(dotenv.config().parsed) // it will automatically pick up key values from .env file
            // })
        ]
    }
};