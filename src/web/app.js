import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import _ from 'lodash';

import { easyWrite } from '../kitsune/files';

import {
  base64ToBuffer as buf, bufferToBase64 as b64,
  hashEdge as E,
} from '../common/hash';
import {
  BUILT_IN_NODES, CODE, COMMAND, EDGE, LIST, MAP_N, READ, STRING,
  SUPPORTS_COMMAND, TO_BASE64, VARIABLE_GET, VARIABLE_SET, WRITE,
} from '../common/nodes';
import * as N from '../common/nodes';
import { CODE_PATH, KITSUNE_PATH } from '../kitsune/config';
import Storage from '../kitsune/storage';
import { expand } from '../kitsune/translate';

const App = system => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ strict: false }));

  // System calls
  app.use((req, res, next) => {
    const { body, url } = req;
    if(url.length < 2) {
      next();
      return;
    }

    const b64CommandId = decodeURIComponent(url.slice(1));
    const commandId = buf(b64CommandId);

    const isSupported = system(SUPPORTS_COMMAND, commandId);
    if(isSupported) {
      const output = system(commandId, body);
      res.json(output);
    } else
      next();
  });

  const getBuiltInNodeMap = () => {
    const mapNode = system(VARIABLE_GET, BUILT_IN_NODES);
    if(mapNode === null)
      return {};

    const map = system(E(READ, MAP_N), mapNode);

    const result = {};
    Object.entries(map).forEach(([nameNode, node]) => {
      const name = system(E(READ, STRING), buf(nameNode));
      result[name] = node;
    });

    return result;
  };

  const text = require('../raw/nodes.js.raw').default;
  app.use('/build', (req, res) => {
    const nodeMap = getBuiltInNodeMap();

    const nodeLines = Object.entries(nodeMap).sort().map(([name, node]) => {
      return `export const ${name} = buf('${b64(node)}');`;
    }).join('\n');

    const code = _.template(text)({ nodeLines });

    // Write file
    const dir = `${CODE_PATH}/src/common`;
    easyWrite(`${dir}/nodes.js`, code);

    res.set('Content-Type', 'text/plain');
    res.send(dir);
  });

  app.use('/init', (req, res) => {
    const nodeMap = {};
    Object.entries(N).forEach(([key, value]) => {
      const stringNode = system(E(WRITE, STRING), key);
      nodeMap[b64(stringNode)] = value;
    });

    const nodeMapId = system(E(WRITE, MAP_N), nodeMap);
    system(VARIABLE_SET, [BUILT_IN_NODES, nodeMapId]);

    res.sendStatus(200);
  });

  app.use('/built-in-nodes', (req, res) => {
    const nodeMap = getBuiltInNodeMap();
    const result = system(TO_BASE64, nodeMap);
    res.send(result);
  });

  // NOTE: These are here for convenience for now
  app.use('/commands', (req, res) => {
    const commands = system(E(LIST, COMMAND));

    const commandMap = {};
    commands.forEach(node => (commandMap[b64(node)] = expand(node)));

    res.json(commandMap);
  });

  app.use('/listEdge', (req, res) => {
    const edges = system(E(LIST, EDGE)).map(edge => edge.map(b64));
    res.json(edges);
  });

  app.use('/listString', (req, res) => {
    const strings = system(E(LIST, STRING)).map(row => ({ ...row, id: b64(row.id) }));
    res.json(strings);
  });

  app.use('/code', (req, res) => {
    const code = system(CODE, buf(req.body));
    res.json(code);
  });

  const prefix = '/expand/';
  app.use(`${prefix}*`, (req, res) => {
    const node = buf(req.url.replace(prefix, ''));
    const name = expand(node);
    res.json(name);
  });

  // TODO: Decouple Stoage
  const storage = Storage(KITSUNE_PATH, system);
  app.use('/save', (req, res) => storage.save().then(() => res.json()));
  app.use('/load', (req, res) => storage.load().then(() => res.json()));

  storage.load().catch(err => {
    console.error('Error: Could not load data.', err.message);
  });

  return app;
};

export default App;
