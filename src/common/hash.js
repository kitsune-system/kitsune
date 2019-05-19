import crypto from 'crypto';
import sha3 from 'js-sha3';

import { EDGE, STRING } from './nodes';

const sha256 = sha3.sha3_256;

const edgeMap = {};

export const random = () => randomBase();

export const randomBase = (size = 256) => {
  const len = Math.ceil(size / 8);
  return crypto.randomBytes(len);
};

export const base64ToBuffer = base64 => {
  if(!base64)
    throw new Error('`base64` must not be null');

  return Buffer.from(base64, 'base64');
};

export const bufferToBase64 = buffer => {
  if(!buffer)
    throw new Error('`base64` must not be null');

  return buffer.toString('base64');
};

export const readEdge = node => edgeMap[bufferToBase64(node)];

export const hashList = list => {
  const hash = sha256.create();
  list.forEach(item => hash.update(item));
  return Buffer.from(hash.buffer());
};

export const hashString = string => hashList([STRING, string]);

const validateHeadTail = args => {
  if(args.length > 2)
    throw new Error('HashEdge must take 2 arguments');

  const [head, tail] = args;

  if(!(head && tail)) {
    throw new Error(
      '`head` and `tail` must be set: ' +
      `{ head: ${bufferToBase64(head)}, tail: ${bufferToBase64(tail)} }`
    );
  }

  return [head, tail];
};

export const hashEdge = (...args) => {
  const [head, tail] = validateHeadTail(args);

  const edge = hashList([EDGE, head, tail]);
  edgeMap[bufferToBase64(edge)] = [bufferToBase64(head), bufferToBase64(tail)];
  return edge;
};

export const deepHashEdge = (...args) => {
  let [head, tail] = validateHeadTail(args);

  if(Array.isArray(head))
    head = deepHashEdge(...head);
  if(Array.isArray(tail))
    tail = deepHashEdge(...tail);

  return hashEdge(head, tail);
};
