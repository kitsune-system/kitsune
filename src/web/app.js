import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import { base64ToBuffer as buf, random } from '../kitsune/hash';
import { SUPPORTS_COMMAND } from '../kitsune/nodes';

const App = system => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  // System calls
  app.use((req, res, next) => {
    const commandId = buf(req.url.slice(1));

    const isSupported = system(SUPPORTS_COMMAND, commandId);
    if(isSupported) {
      const output = system(commandId);
      res.json(output);
    } else
      next();
  });

  // NOTE: These are here for convenience for now
  app.get('/random', (req, res) => {
    const node = random();
    res.json(node.toString('base64'));
  });

  return app;
};

export default App;
