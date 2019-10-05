/* eslint-disable */
import {
  deepHashEdge as E, edgeMap,
  BUILT_IN_NODES, COMMAND, LIST_V, MAP_N, STRING,
  SUPPORTS_COMMAND, SET_VARIABLE, WRITE,
} from '@kitsune-system/common';
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import _ from 'lodash';

import { CODE_PATH, KITSUNE_PATH } from '../kitsune/env';
import { easyWrite } from '../kitsune/files';
import { NODES } from '../kitsune/nodes';
import Storage from '../kitsune/storage';
import { expand } from '../kitsune/translate';

export const App = system => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json({ strict: false }));

  // System calls
  system(SUPPORTS_COMMAND, supportsCommand => {
    app.use(({ body, url }, res, next) => {
      const commandId = decodeURIComponent(url.slice(1));

      supportsCommand(commandId, isSupported => {
        if(!isSupported) {
          next();
          return;
        }

        system(commandId, command => command(body, output => res.json(output)));
      });
    });
  });

  // const text = require('../raw/nodes.js.raw').default;
  // app.use('/build', (req, res) => {
  //   const nodeLines = Object.entries(NODES).sort().map(([name, node]) => {
  //     return `export const ${name} = '${node}';`;
  //   }).join('\n');
  //
  //   const code = _.template(text)({ nodeLines });
  //
  //   // Write file
  //   const dir = `${CODE_PATH}/src/common`;
  //   easyWrite(`${dir}/nodes.js`, code);
  //
  //   res.set('Content-Type', 'text/plain');
  //   res.send(dir);
  // });

  // app.use('/init', (req, res) => {
  //   const nodeMap = {};
  //   Object.entries(NODES).forEach(([key, value]) => {
  //     const stringNode = system(E(WRITE, STRING), key);
  //     nodeMap[stringNode] = value;
  //   });
  //
  //   const nodeMapId = system(E(WRITE, MAP_N), nodeMap);
  //   system(SET_VARIABLE, [BUILT_IN_NODES, nodeMapId]);
  //
  //   res.sendStatus(200);
  // });

  // NOTE: These are here for convenience for now
  // app.use('/commands', (req, res) => {
  //   const commands = system(E(LIST_V, COMMAND));
  //
  //   const commandMap = {};
  //   commands.forEach(node => (commandMap[node] = expand(node)));
  //
  //   res.json(commandMap);
  // });

  // app.use('/code-edges', (req, res) => {
  //   res.send(edgeMap);
  // });

  // const prefix = '/expand/';
  // app.use(`${prefix}*`, (req, res) => {
  //   const node = req.url.replace(prefix, '');
  //   const name = expand(node);
  //   res.json(name);
  // });

  // TODO: Decouple Storage
  // const storage = Storage(KITSUNE_PATH, system);
  // app.use('/save', (req, res) => storage.save().then(() => res.json()));
  // app.use('/load', (req, res) => storage.load().then(() => res.json()));
  //
  // storage.load().catch(err => {
  //   console.error('Error: Could not load data.', err.message);
  // });

  return app;
};
