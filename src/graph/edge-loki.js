import Loki from 'lokijs';

import { bufferToBase64 as b64, hashEdge as E } from '../kitsune/hash';
import { EDGE, LIST, READ, WRITE } from '../kitsune/nodes';

export const DB = () => {
  const db = new Loki();

  db.addCollection('edges', {
    unique: ['id'],
    indicies: ['head', 'tail'],
  });

  return db;
};

// TODO: Convert to and from b64
export const EdgeCommands = edges => ({
  // TODO: How to bind input to args
  [b64(E(WRITE, EDGE))]: ([head, tail]) => {
    const node = E(head, tail);

    const b64Node = b64(node);
    const exists = (edges.by('id', b64Node) !== undefined);
    if(!exists)
      edges.insert({ id: b64Node, head: b64(head), tail: b64(tail) });

    return node;
  },

  [b64(E(READ, EDGE))]: node => {
    const result = edges.by('id', node);
    return [result.head, result.tail];
  },

  [b64(E(LIST, EDGE))]: () => edges.find(),
});
