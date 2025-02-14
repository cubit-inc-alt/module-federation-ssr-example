const path = require('path');
const { merge } = require('webpack-merge');
const shared = require('./webpack.shared');
const moduleFederationPlugin = require('./module-federation');

const FRONTEND_URL= 'https://ssr-example.host-1.contabo.cubit.com.np'

module.exports = merge(shared, {
  name: 'client',
  target: 'web',
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/index.js')],
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist/client'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: `${FRONTEND_URL}/static/`,
  },
  plugins: [moduleFederationPlugin.client],
});
