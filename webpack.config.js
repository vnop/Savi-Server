const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './panel/app/index.js',
  devtool: 'eval',
  output: {
    path: path.resolve(__dirname, 'panel/compiled'),
    publicPath: '/panel/compiled',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/,
        query: { presets: ['es2015', 'react'] }
      },
      {
        test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/,
        query: { presets: ['es2015', 'react'] }
      }
    ]
  }
};