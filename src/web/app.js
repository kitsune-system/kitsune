import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import {
  base64ToBuffer as buf, bufferToBase64 as b64,
  hashEdge as E, random } from '../kitsune/hash';
import { COMMAND, LIST, SUPPORTS_COMMAND } from '../kitsune/nodes';
import Storage from '../kitsune/storage';
import { expand } from '../kitsune/translate';

const App = system => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  // System calls
  app.use((req, res, next) => {
    const { body, url } = req;
    if(url.length < 2) {
      next();
      return;
    }

    const commandId = buf(url.slice(1));

    const isSupported = system(SUPPORTS_COMMAND, commandId);
    if(isSupported) {
      const output = system(commandId, body);
      res.json(output);
    } else
      next();
  });

  // NOTE: These are here for convenience for now
  app.use('/commands', (req, res) => {
    const commands = system(E(LIST, COMMAND));

    const commandMap = {};
    commands.forEach(node => (commandMap[b64(node)] = expand(node)));

    res.json(commandMap);
  });

  app.use('/random', (req, res) => {
    const node = random();
    res.send(node.toString('base64'));
  });

  const prefix = '/expand/';
  app.use(`${prefix}*`, (req, res) => {
    const node = buf(req.url.replace(prefix, ''));
    const name = expand(node);
    res.json(name);
  });

  // TODO: Decouple Stoage
  const path = `${process.env.HOME}/.kitsune`;
  const storage = Storage(path, system);
  app.use('/save', (req, res) => {
    storage.save().then(() => res.send());
  });
  app.use('/load', (req, res) => {
    storage.load().then(() => res.send());
  });

  storage.load().catch(err => {
    console.error('Error: Could not load data.', err.message);
  });

  return app;
};

export default App;
