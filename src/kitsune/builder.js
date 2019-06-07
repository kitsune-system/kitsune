import Loki from 'lokijs';

import MiscCommands from './misc.js';

import { base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E } from '../common/hash';
import { BIND_COMMAND, COMMAND, LIST, SUPPORTS_COMMAND } from '../common/nodes';

import { buildConfig as stringBuildConfig } from '../data/string-loki';
import { buildConfig as edgeBuildConfig } from '../graph/edge-loki';

import { BinaryMap, BinObj, Commands, CommandInstaller } from '../kitsune/util';

import ListCommands from '../struct/list';
import MapCommands from '../struct/map';
import SetCommands from '../struct/set';
import VariableCommands from '../struct/variable';

export const Builder = config => {
  const cache = {};

  const resolver = name => {
    // Check cache
    if(name in cache)
      return cache[name];

    if(!(name in config))
      throw new Error(`No name in builder config for: ${name}`);

    let value = config[name];

    let afterFn = null;
    if(typeof value === 'function') {
      const after = fn => (afterFn = fn);
      value = value(resolver, after);
    }

    cache[name] = value;

    // Run afterFn is it's been set
    if(typeof afterFn === 'function')
      afterFn(resolver);

    return value;
  };

  return resolver;
};

const SystemCommands = system => Commands(
  // TODO: Bind system to these two
  [SUPPORTS_COMMAND, commandId => b64(commandId) in system()],
  [E(LIST, COMMAND), () => Object.keys(system()).map(key => buf(key))],
);

export const extend = binaryMap => {
  const baseHandler = binaryMap.handlers[1];

  binaryMap.handlers[1] = commandId => {
    if(!(b64(commandId) in binaryMap()))
      throw new Error(`There is no command for id: ${commandId.toString('base64')}`);

    return baseHandler(commandId);
  };

  return binaryMap;
};

export const systemModules = BinaryMap(BinObj(
  [BIND_COMMAND, ({ install, system, value, buildArgs }) => {
    const boundFns = {};

    Object.entries(value).forEach(([fnName, fnNode]) => {
      const hasCommand = b64(fnNode) in system();
      if(!hasCommand) // If missing, try to install
        install(fnNode);

      boundFns[fnName] = system(fnNode);
    });

    buildArgs(boundFns);
  }],
  // [INPUT_TYPE, args => {
  //   console.log('YUP it\'s input type:', args);
  //   return args.fn;
  // }],
));

export const config = {
  lokiDB: () => new Loki(),

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
    const result = BinaryMap();

    const commandList = build('commandList');
    commandList.forEach(buildName => {
      const commands = build(buildName);
      commands((node, fn) => result(node, fn));
    });

    return result;
  },

  systemModules: () => systemModules,

  system: (build, after) => {
    const system = extend(BinaryMap());

    after(build => {
      const commands = build('commands');
      const install = CommandInstaller(system, build('systemModules'), commands);

      commands(node => install(node));
    });

    return system;
  },
};
