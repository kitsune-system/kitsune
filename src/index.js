import { execSync } from 'child_process';
import fs from 'fs';
import http from 'http';
import https from 'https';
import _ from 'lodash';

import app from './app';

import * as nodes from './app/nodes';
_.each(nodes, (node, name) => {
  console.log(name, node);
});
console.log();

// Config
const {
  KITSUNE_ON_STARTED: onStarted,
  KITSUNE_HTTP_PORT,
  KITSUNE_HTTPS_PORT: securePort,
  KITSUNE_SERVER_NAME
} = process.env;

const insecurePort = KITSUNE_HTTP_PORT || 8080;

const onListen = () => {
  console.log('Kitsune started!');

  if(onStarted) {
    const buffer = execSync(onStarted);
    console.log(buffer.toString());
  }
};

if(securePort) {
  console.log(`Starting Kitsune [SECURE] on port ${securePort} ...`);
  https.createServer({
    cert: fs.readFileSync('kitsune.crt'),
    key: fs.readFileSync('kitsune.key')
  }, app).listen(securePort, onListen);

  // Redirect all traffic to https
  http.createServer((req, res) => {
    res.writeHead(301, {
      Location: `https://${KITSUNE_SERVER_NAME}${req.url}`
    });
    res.end();
  }).listen(insecurePort);
} else {
  console.log(`Starting Kitsune ...insecure... on port ${insecurePort} ...`);
  http.createServer(app).listen(insecurePort, onListen);
}
