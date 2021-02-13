const path = require('path');

module.exports = {
  // Build Mode
  mode: 'development',
  // Electron Entrypoint
  entry: './src/main.ts',
  target: 'electron-main',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  module: {
    rules: [{
        test: /\.(js|ts|tsx)$/,
        include: /src/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    }]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
  }
}