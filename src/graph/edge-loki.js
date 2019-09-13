import {
  deepHashEdge as E, ERASE, EDGE, HEAD, LIST, READ, TAIL, WRITE,
} from '@kitsune-system/common';

import { Commands } from '../kitsune/util';

export const EdgeCommands = graph => Commands(
  [E(READ, EDGE), id => graph.read(id)],

  [E(LIST, HEAD), graph.heads],
  [E(LIST, TAIL), graph.tails],

  [E(WRITE, EDGE), edge => graph.write(edge)],

  [E(ERASE, EDGE), id => graph.erase(id)],

  [E(LIST, EDGE), graph.list],
);

export const buildConfig = {
  edgeCollection: build => build('lokiDB').addCollection('edges', {
    unique: ['id'],
    indicies: ['head', 'tail'],
  }),
  edgeCommands: build => EdgeCommands(build('graph')),
};
