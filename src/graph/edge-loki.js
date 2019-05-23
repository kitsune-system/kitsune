import { base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E } from '../common/hash';
import { DESTROY, EDGE, HEAD, LIST, READ, TAIL, WRITE } from '../common/nodes';

import { Commands } from '../kitsune/util';

const resultToEdge = result => [buf(result.head), buf(result.tail), buf(result.id)];

export const EdgeCommands = edges => Commands(
  [E(WRITE, EDGE), ([head, tail]) => {
    if(typeof head === 'string' || typeof tail === 'string')
      throw new Error('`head` and `tail` must be buffers, not strings');

    const node = E(head, tail);

    const id = b64(node);
    const exists = (edges.by('id', id) !== undefined);
    if(!exists)
      edges.insert({ id, head: b64(head), tail: b64(tail) });

    return node;
  }],

  [E(READ, EDGE), node => {
    if(typeof node === 'string')
      throw new Error('`node` must be a buffer, not a string');

    const result = edges.by('id', b64(node));
    return result ? resultToEdge(result) : null;
  }],

  [E(DESTROY, EDGE), node => {
    if(typeof node === 'string')
      throw new Error('`node` must be a buffer, not a string');

    edges.findAndRemove({ id: b64(node) });
  }],

  [E(LIST, EDGE), () => edges.find().map(resultToEdge)],

  [E(LIST, HEAD), node => edges.find({ tail: b64(node) }).map(row => buf(row.head))],
  [E(LIST, TAIL), node => edges.find({ head: b64(node) }).map(row => buf(row.tail))],
);

export const buildConfig = {
  edgeCollection: build => build('lokiDB').addCollection('edges', {
    unique: ['id'],
    indicies: ['head', 'tail'],
  }),
  edgeCommands: build => EdgeCommands(build('edgeCollection')),
};
