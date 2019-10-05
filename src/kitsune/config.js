import { Core, SUPPORTS_COMMAND } from '@kitsune-system/common';
import Loki from 'lokijs';

import { coreConfig as stringConfig } from '../data/sqlite3-string';

import { buildConfig as stringBuildConfig } from '../data/string-loki';
import { buildConfig as edgeBuildConfig } from '../graph/edge-loki';
import { LokiGraph } from '../graph/loki-graph';
import { App as Webapp } from '../web/app';
import createAndListen from '../web/server';
import WebSocketServer from '../web/web-socket';

import { buildConfig as commandBuildConfig } from './commands';
import * as env from './env';

import { coreConfig as miscConfig } from './misc';

export const config = {
  ...env,

  ...edgeBuildConfig,
  ...stringBuildConfig,

  ...commandBuildConfig,

  lokiDB: () => new Loki(),
  graph: build => LokiGraph(build('edgeCollection')),

  system: build => build('core'),
  webapp: build => Webapp(build('core')),

  coreConfig: {
    ...stringConfig,
    ...miscConfig,
  },

  core: build => {
    const coreConfig = build('coreConfig');

    const config = {
      ...coreConfig,
      [SUPPORTS_COMMAND]: {
        fn: () => (systemId, output) => output(systemId in config),
      },
      // [E(LIST_V, COMMAND)]: { fn: () => (_, output) => output(Object.keys(config)) },
    };

    return Core(config);
  },

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
      console.log('MSG', msg, session);
    },
  }),
};
