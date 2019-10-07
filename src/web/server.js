import { exec } from 'child_process';
import fs from 'fs';
import http from 'http';
import https from 'https';

const onListen = () => {
  exec('touch $(find -path "./src/*.spec.int.js")');
};

export const Servers = (app, { SERVER_NAME, SECURE_PORT, INSECURE_PORT }) => {
  let server;
  let listen;

  if(SECURE_PORT) {
    // Create both secure endpoint and insecure endpoint that redirects
    server = https.createServer({
      cert: fs.readFileSync('kitsune.crt'),
      key: fs.readFileSync('kitsune.key'),
    }, app);

    // Redirect all traffic to https
    const altServer = http.createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://${SERVER_NAME}${req.url}`,
      });
      res.end();
    });

    listen = () => {
      console.log(`Starting Kitsune [SECURE] on port ${SECURE_PORT} ...`);
      server.listen(SECURE_PORT, onListen);
      altServer.listen(INSECURE_PORT);
    };
  } else {
    // Create insecure endpoint
    server = http.createServer(app);

    listen = () => {
      console.log(`Starting Kitsune ...insecure... on port ${INSECURE_PORT} ...`);
      server.listen(INSECURE_PORT, onListen);
    };
  }

  return { server, listen };
};
