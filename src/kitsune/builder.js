import Loki from 'lokijs';

import MiscCommands from './misc.js';

import { buildConfig as stringBuildConfig } from '../data/string-loki';
import { buildConfig as edgeBuildConfig } from '../graph/edge-loki';

import ListCommands from '../struct/list';
import MapCommands from '../struct/map';
import SetCommands from '../struct/set';
import VariableCommands from '../struct/variable';

import { CommonSystem } from '../system/builder';

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

export const config = {
  lokiDB: () => new Loki(),

  miscCommands: build => MiscCommands(build('system')),

  ...edgeBuildConfig,
  ...stringBuildConfig,
  listCommands: build => ListCommands(build('system')),
  setCommands: build => SetCommands(build('system')),
  mapCommands: build => MapCommands(build('system')),
  variableCommands: build => VariableCommands(build('system')),

  commandList: [
    'miscCommands',

    'edgeCommands',
    'stringCommands',

    'listCommands',
    'setCommands',
    'mapCommands',
    'variableCommands',
  ],
  commands: build => build('commandList')
    .reduce((agg, buildName) => ({ ...agg, ...build(buildName) }), {}),

  system: (build, after) => {
    const system = CommonSystem();

    after(build => {
      const commands = build('commands');
      Object.entries(commands)
        .forEach(([commandId, fn]) => system(commandId, fn));
    });

    return system;
  },
};
