const deps = require('../package.json').dependencies;
const { ModuleFederationPlugin } = require('webpack').container;
const { NodeFederationPlugin, StreamingTargetPlugin } = require('@module-federation/node');

module.exports = {
  client: new ModuleFederationPlugin({
    name: 'remote2',
    filename: 'remoteEntry.js',
    remotes: {},
    exposes: {
      './Image': './src/Image',
      './App': './src/App',
    },
    shared: {
      react: {
        singleton: true,
        requiredVersion: deps.react,
        eager: true,
      },
      'react-dom': {
        singleton: true,
        requiredVersion: deps['react-dom'],
        eager: true,
      },
    },
  }),
  server: [
    new NodeFederationPlugin({
      name: 'remote2',
      filename: 'remoteEntry.js',
      library: { type: 'commonjs-module' },
      remotes: {},
      exposes: {
        './Image': './src/Image',
        './App': './src/App',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
    new StreamingTargetPlugin({
      name: 'remote2',
      library: { type: 'commonjs-module' },
      remotes: {},
    }),
  ],
};
