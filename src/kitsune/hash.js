import crypto from 'crypto';
import sha3 from 'js-sha3';

const sha256 = sha3.sha3_256;

const edgeMap = {};

export const random = () => crypto.randomBytes(32);

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

export const EDGE = base64ToBuffer('9NeOSRxG9JCQMxyjn8ne/oTHxiaQRfWp4mf96DRzpa0=');

export const hashString = string => Buffer.from(sha256.buffer(string));

export const hashList = list => {
  const hash = sha256.create();
  list.forEach(item => hash.update(item));
  return Buffer.from(hash.buffer());
};

export const hashEdge = (head, tail) => {
  if(!(head && tail)) {
    throw new Error(
      '`head` and `tail` must be set: ' +
      `{ head: ${bufferToBase64(head)}, tail: ${bufferToBase64(tail)} }`
    );
  }

  const edge = hashList([EDGE, head, tail]);
  edgeMap[bufferToBase64(edge)] = [bufferToBase64(head), bufferToBase64(tail)];
  return edge;
};

export const readEdge = node => edgeMap[bufferToBase64(node)];
