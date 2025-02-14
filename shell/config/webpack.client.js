const path = require('path');
const { merge } = require('webpack-merge');
const shared = require('./webpack.shared');
const moduleFederationPlugin = require('./module-federation');

const FRONTEND_URL= 'http://localhost:3000/static/main.js'

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
