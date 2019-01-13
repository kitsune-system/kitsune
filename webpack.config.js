'use strict';

const { execSync } = require('child_process');
const nodeExternals = require('webpack-node-externals');

const env = process.env.NODE_ENV || 'production';
console.log(`Webpack ENV: ${env}`);

const isTest = () => env === 'test' || env === 'integration-test';

const AfterEmitPlugin = fn => ({
  apply: (compiler) => {
    compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
      if(!isTest())
        fn()
    });
  }
});

const plainJs = string => {
  const isJS = /.js$/.test(string);
  const isSpec = /\.spec\.js$/.test(string);

  const result = isJS && !isSpec;
  console.log('PJS', string, result);
  return result;
};

// default production config
const config = {
  entry: './src/index',

  mode: 'production',
  target: 'node',

  externals: [nodeExternals()],

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      enforce: 'pre'
    }]
  }
};

if(env === 'development') {
  Object.assign(config, {
    mode: 'development',
    devtool: 'source-map',
    watchOptions: {
      ignored: '*.spec.js'
    },
    plugins: [AfterEmitPlugin(() => {
      execSync('./bin/reload-service');
    })]
  });
}

if(env === 'test') {
  Object.assign(config, {
    mode: 'development',
    entry: './src/index.spec',
    output: {
      filename: 'spec.js'
    },
    devtool: 'source-map',
    plugins: [AfterEmitPlugin(() => {
      execSync('./bin/reload-service');
    })]
  });
}

if(env === 'integration-test') {
  Object.assign(config, {
    mode: 'development',
    entry: './src/integration.spec',
    output: {
      filename: 'integration.spec.js'
    },
    devtool: 'source-map'
  });
}

module.exports = config;
