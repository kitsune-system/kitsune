/* eslint-disable */
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import {
  base64ToBuffer as buf, bufferToBase64 as b64,
  hashEdge as E, random } from '../kitsune/hash';
import { COMMAND, LIST, SUPPORTS_COMMAND } from '../kitsune/nodes';
import { expand } from '../kitsune/translate';

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
  app.get('/list', (req, res) => {
    const commands = system(E(LIST, COMMAND));

    const commandMap = {};
    commands.forEach(node => commandMap[b64(node)] = expand(node));

    res.json(commandMap);
  });

  app.get('/random', (req, res) => {
    const node = random();
    res.json(node.toString('base64'));
  });

  const prefix = '/expand/';
  app.get(`${prefix}*`, (req, res) => {
    const node = buf(req.url.replace(prefix, ''));
    const name = expand(node);
    res.json(name);
  });

  return app;
};

export default App;
