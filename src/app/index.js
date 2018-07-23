import express from 'express';
import bodyParser from 'body-parser';
import { hexToBase64, random } from './hash';

const app = express();

app.use(bodyParser.json());

app.get('/hex2base64/:hex', (req, res) => {
  const { hex } = req.params;
  const base64 = hexToBase64(hex);

  res.json(base64);
});

app.get('/random', (req, res) => {
  const node = random();
  res.json(node);
});

app.all('/:node', (req, res) => {
  const { node } = req.params;
  console.log('N', node);

  res.json({ msg: `Hello ${node}!` });
});

export default app;
