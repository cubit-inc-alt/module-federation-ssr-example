const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

// Create a simplified config without Module Federation for development
module.exports = merge(require('./webpack.shared'), {
  mode: 'development',
  target: 'web',
  devtool: 'eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3009',
    'webpack/hot/only-dev-server',
    './src/App.jsx',
  ],
  output: {
    publicPath: 'http://localhost:3009/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['react-refresh/babel'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
    new ReactRefreshWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../public'),
    },
    port: 3009,
    hot: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    client: {
      overlay: false,
      progress: true,
    },
  },
}); 