import {
  deepHashEdge as E, ERASE, EDGE, HEAD, LIST_V, READ, TAIL, WRITE,
} from '@kitsune-system/common';

import { Commands } from '../kitsune/util';

export const EdgeCommands = graph => Commands(
  [E(WRITE, EDGE), graph.write],
  [E(READ, EDGE), graph.read],
  [E(ERASE, EDGE), graph.erase],

  [E(LIST_V, EDGE), graph.list],
  [E(LIST_V, HEAD), graph.heads],
  [E(LIST_V, TAIL), graph.tails],
);

export const buildConfig = {
  edgeCollection: build => build('lokiDB').addCollection('edges', {
    unique: ['id'],
    indicies: ['head', 'tail'],
  }),
};
