import { getNativeName } from './translate';

import { bufferToBase64 as b64, hashEdge as E, random } from '../kitsune/hash';
import { GET, NATIVE_NAME, RANDOM } from '../kitsune/nodes';
import { CommonSystem as System } from '../system/builder';
import { DB, EdgeCommands } from '../graph/edge-loki';

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
