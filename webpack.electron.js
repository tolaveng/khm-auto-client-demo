const path = require('path');

module.exports = {
  // Build Mode
  //mode: 'development',
  // Electron Entrypoint
  entry: './src/main.ts',
  target: 'electron-main',
  //target: 'electron-renderer',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  //devtool: 'source-map', //'inline-source-map',
  module: {
    rules: [{
        test: /\.(js|ts|tsx)$/,
        include: /src/,
        exclude: /node_modules/,
        loader: 'babel-loader',
    }]
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  }
}