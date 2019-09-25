import { Map } from '@gamedevfox/katana';
import { BIND_COMMAND } from '@kitsune-system/common';
import Loki from 'lokijs';

import { buildConfig as stringBuildConfig } from '../data/string-loki';
import { buildConfig as edgeBuildConfig } from '../graph/edge-loki';
import LokiGraph from '../graph/loki-graph';
import Webapp from '../web/app';
import createAndListen from '../web/server';
import WebSocketServer from '../web/web-socket';

import { buildConfig as commandBuildConfig } from './commands';
import * as env from './env';
import { CommandInstaller } from './util';

export const systemModules = Map({
  [BIND_COMMAND]: ({ install, system, value, buildArgs }) => {
    const boundFns = {};

    Object.entries(value).forEach(([fnName, fnNode]) => {
      const hasCommand = fnNode in system();
      if(!hasCommand) // If missing, try to install
        install(fnNode);

      boundFns[fnName] = system(fnNode);
    });

    buildArgs(boundFns);
  },
  // [INPUT_TYPE]: args => {
  //   console.log('YUP it\'s input type:', args);
  //   return args.fn;
  // },
});

export const config = {
  ...env,

  lokiDB: () => new Loki(),
  graph: build => LokiGraph(build('edgeCollection')),

  ...edgeBuildConfig,
  ...stringBuildConfig,

  ...commandBuildConfig,

  systemModules: () => systemModules,

  // TODO: Use `core` name instead of `system`
  core: (build, after) => {
    const system = Map();

    after(build => {
      const commands = build('commands');
      const install = CommandInstaller(system, build('systemModules'), commands);

      commands(node => install(node));
    });

    return system;
  },
  system: build => build('core'),

  webapp: build => Webapp(build('core')),

  serverAndListen: build => {
    const config = ['SERVER_NAME', 'SECURE_PORT', 'INSECURE_PORT'].reduce((config, name) => {
      config[name] = build(name);
      return config;
    }, {});

    return createAndListen(build('webapp'), config);
  },

  server: build => build('serverAndListen').server,
  webSocketServer: build => WebSocketServer({
    server: build('server'),
    handler: (msg, session) => {
      console.log('MSG', msg);

      session.count++;

      const res = { ...session };
      delete res.ws;

      return res;
    },
  }),

  runFn: build => () => {
    // Ensure WebSocketServer is bound to server
    build('webSocketServer');

    build('serverAndListen').listen();
  },
};
