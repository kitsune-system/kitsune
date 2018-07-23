import crypto from 'crypto';
import sha3 from 'js-sha3';
import { recordHashEdge } from './hash-local';

const sha256 = sha3.sha3_256;

export const base64ToHex = base64 => {
  const buffer = Buffer.from(base64, 'base64');
  return buffer.toString('hex');
};

export const hexToBase64 = hex => {
  const buffer = Buffer.from(hex, 'hex');
  return buffer.toString('base64');
};

export const hash = input => Buffer.from(sha256.array(input)).toString('base64');

// eslint-disable-next-line no-warning-comments
// TODO: Have a `hash-local` version of this so we know when we're using random nodes (and maybe their names)
export const random = () => {
  const bytes = crypto.randomBytes(32);
  return hash(bytes);
};

const hashToBuffer = hash => Buffer.from(hash, 'base64');

export const hashList = nodes => {
  const buffers = nodes.map(hashToBuffer);
  const buffer = Buffer.concat(buffers);
  return hash(buffer);
};

// eslint-disable-next-line no-warning-comments
// TODO: Decide if this is a good idea (... I think it is)
export const simpleHashEdge = (head, tail) => hashList([head, tail]);

export const hashEdge = (edgeDef, tail, record = false) => {
  // Accepts two arguments or array with two elements (or string which does nothing)
  if(tail)
    edgeDef = [edgeDef, tail];

  // This is the bottom of the recursive call
  if(typeof edgeDef === 'string')
    return edgeDef;

  const headHash = hashEdge(edgeDef[0], null, record);
  const tailHash = hashEdge(edgeDef[1], null, record);

  const hashFn = record ? recordHashEdge : simpleHashEdge;
  return hashFn(headHash, tailHash);
};

export const hashType = (type, list) => {
  const listNode = hashList(list);
  return hashEdge(type, listNode);
};
