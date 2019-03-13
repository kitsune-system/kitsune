import Loki from 'lokijs';

import { base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E } from '../kitsune/hash';
import { EDGE, LIST, READ, WRITE } from '../kitsune/nodes';

export const DB = () => {
  const db = new Loki();

  db.addCollection('edges', {
    unique: ['id'],
    indicies: ['head', 'tail'],
  });

  return db;
};

const resultToEdge = result => [buf(result.head), buf(result.tail), buf(result.id)];

export const EdgeCommands = edges => ({
  [b64(E(WRITE, EDGE))]: ([head, tail]) => {
    if(typeof head === 'string' || typeof tail === 'string')
      throw new Error('`head` and `tail` must be buffers, not strings');

    const node = E(head, tail);

    const id = b64(node);
    const exists = (edges.by('id', id) !== undefined);
    if(!exists)
      edges.insert({ id, head: b64(head), tail: b64(tail) });

    return node;
  },

  [b64(E(READ, EDGE))]: node => {
    if(typeof node === 'string')
      throw new Error('`node`must be a buffer, not a string');

    const result = edges.by('id', node);
    return resultToEdge(result);
  },

  [b64(E(LIST, EDGE))]: () => edges.find().map(resultToEdge),
});