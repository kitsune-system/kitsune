'use strict';

const { execSync } = require('child_process');
const nodeExternals = require('webpack-node-externals');

const {
  NODE_ENV,
  ON_BUILD: onBuild
} = process.env;

const webpackEnv = NODE_ENV || 'production';
console.log(`Webpack ENV: ${webpackEnv}`);

const isTest = () => webpackEnv === 'test' || webpackEnv === 'integration-test';

const AfterEmitPlugin = fn => ({
  apply: compiler => compiler.hooks.afterEmit.tap('AfterEmitPlugin', fn)
});

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

if(webpackEnv === 'development') {
  Object.assign(config, {
    mode: 'development',
    devtool: 'source-map',
    watchOptions: {
      ignored: '*.spec.js'
    }
  });
}

if(webpackEnv === 'test') {
  Object.assign(config, {
    mode: 'development',
    entry: './src/index.spec',
    output: {
      filename: 'spec.js'
    },
    devtool: 'source-map'
  });
}

if(webpackEnv === 'integration-test') {
  Object.assign(config, {
    mode: 'development',
    entry: './src/integration.spec',
    output: {
      filename: 'integration.spec.js'
    },
    devtool: 'source-map'
  });
}

if(onBuild) {
  config.plugins = [AfterEmitPlugin(() => {
    console.log(`Running \`${onBuild}\``);
    execSync(onBuild);
  })];
}

module.exports = config;
