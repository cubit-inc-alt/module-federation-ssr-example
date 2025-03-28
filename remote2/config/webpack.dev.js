const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const moduleFederationPlugin = require('./module-federation');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(require('./webpack.shared'), {
  mode: 'development',
  target: 'web',
  devtool: 'eval-source-map',
  entry: [
    // React HMR entry point
    'webpack-dev-server/client?http://localhost:3009',
    'webpack/hot/only-dev-server',
    './src/index',
  ],
  output: {
    publicPath: 'http://localhost:3009/',
    filename: '[name].js',
    chunkFilename: '[name].[contenthash].js',
  },
  optimization: {
    runtimeChunk: false,
  },
  plugins: [
    moduleFederationPlugin.client,
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist'),
    },
    port: 3009,
    hot: true,
    liveReload: false,
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