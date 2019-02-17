/* eslint-disable */
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';

import { bufferToBase64 as b64, base64ToBuffer as buf, random } from '../kitsune/hash';
import { RANDOM, SUPPORTS_COMMAND } from '../kitsune/nodes';

import { CommonSystem as System } from '../system/builder';
const system = System({
  [b64(RANDOM)]: random,
});

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
