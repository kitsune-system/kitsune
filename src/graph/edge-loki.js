import Loki from 'lokijs';

import { bufferToBase64 as b64, hashEdge as E } from '../kitsune/hash';
import { EDGE, READ, WRITE } from '../kitsune/nodes';

export const DB = () => {
  const db = new Loki();

  db.addCollection('edges', {
    unique: ['id'],
    indicies: ['head', 'tail'],
  });

  return db;
};

export const EdgeCommands = edges => ({
  // TODO: How to bind input to args
  [b64(E(WRITE, EDGE))]: ([head, tail]) => {
    const node = E(head, tail);

    const exists = (edges.by('id', node) !== undefined);
    if(!exists)
      edges.insert({ id: node, head, tail });

    return node;
  },

  [b64(E(READ, EDGE))]: node => {
    const result = edges.by('id', node);
    return [result.head, result.tail];
  },
});
