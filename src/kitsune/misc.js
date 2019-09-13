import {
  hashEdge as E, GET, NATIVE_NAME, RANDOM, MAP_V, PIPE,
} from '@kitsune-system/common';

import { NODES } from '../kitsune/nodes';

import { random } from './random';
import { Commands } from './util';

const map = system => ({ input, mapCommand }) => input.map(
  item => system(mapCommand)(item)
);

const pipe = system => ({ input, commandList }) => {
  commandList.forEach(command => {
    input = system(command)(input);
  });

  return input;
};

export const MiscCommands = system => Commands(
  [E(GET, NATIVE_NAME), node => NODES[node]],
  [RANDOM, () => random()],

  [MAP_V, map(system)], // TODO: Bind system
  [PIPE, pipe(system)], // TODO: Bind system
);

export default MiscCommands;
