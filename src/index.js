import _ from 'lodash';

import webapp from './web/app';
import createAndListen from './web/server';

import * as nodes from './kitsune/nodes';
_.each(nodes, (node, name) => {
  console.log(name, node.toString('base64'));
});
console.log();

// Config
const {
  KITSUNE_ON_STARTED: onStarted,
  KITSUNE_HTTP_PORT,
  KITSUNE_HTTPS_PORT: securePort,
  KITSUNE_SERVER_NAME: serverName,
} = process.env;

const insecurePort = KITSUNE_HTTP_PORT || 8080;

createAndListen(webapp, { serverName, securePort, insecurePort, onStarted });
