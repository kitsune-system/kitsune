import { exec } from 'child_process';
import fs from 'fs';
import http from 'http';
import https from 'https';

const createAndListen = (app, { serverName, securePort, insecurePort }) => {
  const onListen = () => {
    console.log('Kitsune started!');
    exec('touch $(find -path "./src/*.spec.int.js")');
  };

  if(securePort) {
    // Create both secure endpoint and insecure endpoint that redirects
    console.log(`Starting Kitsune [SECURE] on port ${securePort} ...`);
    https.createServer({
      cert: fs.readFileSync('kitsune.crt'),
      key: fs.readFileSync('kitsune.key'),
    }, app).listen(securePort, onListen);

    // Redirect all traffic to https
    http.createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://${serverName}${req.url}`,
      });
      res.end();
    }).listen(insecurePort);
  } else {
    // Create insecure endpoint
    console.log(`Starting Kitsune ...insecure... on port ${insecurePort} ...`);
    http.createServer(app).listen(insecurePort, onListen);
  }
};

export default createAndListen;
