import { bufferToBase64 as b64, deepHashEdge as E, random } from '../common/hash';
import { GET, NATIVE_NAME, RANDOM } from '../common/nodes';
import { DB, EdgeCommands } from '../graph/edge-loki';
import StringCommands from '../data/string-loki';
import { CommonSystem as System } from '../system/builder';

import { getNativeName } from './translate';

export const builder = config => {
  const cache = {};

  const resolver = name => {
    // Check cache
    if(name in cache)
      return cache[name];

    let value = config[name];

    if(typeof value === 'function')
      value = value(resolver);

    cache[name] = value;
    return value;
  };

  return resolver;
};

const config = {
  db: () => DB(),
  edges: build => build('db').getCollection('edges'),
  strings: build => build('db').getCollection('strings'),
  edgeCommands: build => EdgeCommands(build('edges')),
  stringCommands: build => StringCommands(build('strings')),
};

export { config };

// Deprectaed below
const moduleCommandMap = {
  random: () => ({ [b64(RANDOM)]: random }),
  nativeName: () => ({ [b64(E(GET, NATIVE_NAME))]: getNativeName }),
  edge: () => {
    const db = DB();
    const edges = db.getCollection('edges');
    return EdgeCommands(edges);
  },
};

const build = (...modules) => {
  let commands;

  modules.forEach(module => {
    if(!(module in moduleCommandMap))
      throw new Error(`No such module in moduleCommandMap: ${module}`);

    const moduleCommands = moduleCommandMap[module]();
    commands = { ...commands, ...moduleCommands };
  });

  return System(commands);
};

export default build;
