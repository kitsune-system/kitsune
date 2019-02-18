import { exec } from 'child_process';
import fs from 'fs';
import http from 'http';
import https from 'https';

const createAndListen = (app, { serverName, securePort, insecurePort, onStarted }) => {
  const onListen = () => {
    console.log('Kitsune started!');

    if(onStarted) {
      console.log(`Running \`${onStarted}\``);
      exec(onStarted, (error, stdout) => {
        if(stdout.length) {
          console.log('=== BEGIN KITSUNE_ON_STARTED ===');
          console.log(stdout.toString());
          console.log('=== END KITSUNE_ON_STARTED ===');
        } else
          console.log('=== KITSUNE_ON_STARTED SCRIPT OUTPUT WAS EMPTY ===');
      });
    }
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
