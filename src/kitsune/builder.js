import Loki from 'lokijs';

import { Map } from '@gamedevfox/katana';
import {
  deepHashEdge as E, BIND_COMMAND, COMMAND, LIST, SUPPORTS_COMMAND,
} from '@kitsune-system/common';

import { buildConfig as stringBuildConfig } from '../data/string-loki';
import { buildConfig as edgeBuildConfig } from '../graph/edge-loki';
import LokiGraph from '../graph/loki-graph';

import { Commands, CommandInstaller } from '../kitsune/util';

import ListCommands from '../struct/list';
import MapCommands from '../struct/map';
import SetCommands from '../struct/set';
import VariableCommands from '../struct/variable';

import Webapp from '../web/app';
import createAndListen from '../web/server';
import WebSocketServer from '../web/web-socket';

import MiscCommands from './misc.js';

const SystemCommands = system => Commands(
  // TODO: Bind system to these two
  [SUPPORTS_COMMAND, commandId => commandId in system()],
  [E(LIST, COMMAND), () => Object.keys(system()).map(key => key)],
);

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
  lokiDB: () => new Loki(),
  graph: build => LokiGraph(build('edgeCollection')),

  systemCommands: build => SystemCommands(build('system')),
  miscCommands: build => MiscCommands(build('system')),

  ...edgeBuildConfig,
  ...stringBuildConfig,

  listCommands: () => ListCommands,
  setCommands: () => SetCommands,
  mapCommands: () => MapCommands,
  variableCommands: () => VariableCommands,

  commandList: [
    'systemCommands',
    'miscCommands',

    'edgeCommands',
    'stringCommands',

    'listCommands',
    'setCommands',
    'mapCommands',
    'variableCommands',
  ],

  commands: build => {
    const result = Map();

    const commandList = build('commandList');
    commandList.forEach(buildName => {
      const commands = build(buildName);
      commands((node, fn) => result(node, fn));
    });

    return result;
  },

  systemModules: () => systemModules,

  system: (build, after) => {
    const system = Map();

    after(build => {
      const commands = build('commands');
      const install = CommandInstaller(system, build('systemModules'), commands);

      commands(node => install(node));
    });

    return system;
  },

  webapp: build => Webapp(build('system')),

  env: process.env,

  serverName: build => build('env').KITSUNE_SERVER_NAME,
  securePort: build => build('env').KITSUNE_HTTPS_PORT,
  insecurePort: build => build('env').KITSUNE_HTTP_PORT || 8080,

  serverAndListen: build => createAndListen(build('webapp'), {
    serverName: build('serverName'),
    securePort: build('securePort'),
    insecurePort: build('insecurePort'),
  }),

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
