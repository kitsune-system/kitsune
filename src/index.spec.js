import './spec-common';

const context = require.context('./app', true, /\.spec\.js$/);
context.keys().forEach(context);
