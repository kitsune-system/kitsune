import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import { hexToBase64, random } from '../app/hash';
import { SUPPORTS_COMMAND } from '../app/nodes';

const system = () => {};

const app = express();

app.use(cors());
app.use(bodyParser.json());

// System calls
app.use((req, res, next) => {
  const path = req.url.slice(1);

  const isSupported = system(SUPPORTS_COMMAND, path);
  if(isSupported) {
    const output = system(path);
    res.json(output);
  } else
    next();
});

// Extra
app.get('/hex2base64/:hex', (req, res) => {
  const { hex } = req.params;
  const base64 = hexToBase64(hex);

  res.json(base64);
});

app.get('/random', (req, res) => {
  const node = random();
  res.json(node);
});

export default app;
