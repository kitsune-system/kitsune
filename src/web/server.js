import { exec } from 'child_process';
import fs from 'fs';
import http from 'http';
import https from 'https';

const onListen = () => {
  console.log('Kitsune started!');
  exec('touch $(find -path "./src/*.spec.int.js")');
};

const createAndListen = (app, { serverName, securePort, insecurePort }) => {
  let server;
  let listen;

  if(securePort) {
    // Create both secure endpoint and insecure endpoint that redirects
    console.log(`Starting Kitsune [SECURE] on port ${securePort} ...`);
    server = https.createServer({
      cert: fs.readFileSync('kitsune.crt'),
      key: fs.readFileSync('kitsune.key'),
    }, app);

    // Redirect all traffic to https
    const altServer = http.createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://${serverName}${req.url}`,
      });
      res.end();
    });

    listen = () => {
      server.listen(securePort, onListen);
      altServer.listen(insecurePort);
    };
  } else {
    // Create insecure endpoint
    console.log(`Starting Kitsune ...insecure... on port ${insecurePort} ...`);
    server = http.createServer(app);

    listen = () => {
      server.listen(insecurePort, onListen);
    };
  }

  return { server, listen };
};

export default createAndListen;
