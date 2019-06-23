import { hashEdge as E } from '../common/hash';
import { ERASE, EDGE, HEAD, LIST, READ, TAIL, WRITE } from '../common/nodes';

import { Commands } from '../kitsune/util';

export const EdgeCommands = graph => Commands(
  [E(READ, EDGE), id => {
    if(typeof id === 'string')
      throw new Error('`node` must be a buffer, not a string');

    return graph.read(id);
  }],

  [E(LIST, HEAD), graph.heads],
  [E(LIST, TAIL), graph.tails],

  [E(WRITE, EDGE), edge => {
    const [head, tail] = edge;

    if(typeof head === 'string' || typeof tail === 'string')
      throw new Error('`head` and `tail` must be buffers, not strings');

    return graph.write(edge);
  }],

  [E(ERASE, EDGE), id => {
    if(typeof id === 'string')
      throw new Error('`node` must be a buffer, not a string');

    graph.erase(id);
  }],

  [E(LIST, EDGE), graph.list],
);

export const buildConfig = {
  edgeCollection: build => build('lokiDB').addCollection('edges', {
    unique: ['id'],
    indicies: ['head', 'tail'],
  }),
  edgeCommands: build => EdgeCommands(build('graph')),
};
