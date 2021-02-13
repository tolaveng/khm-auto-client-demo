const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    //target: 'electron-renderer',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        compress: false,
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
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './src/index.html'
        })
      ]
};