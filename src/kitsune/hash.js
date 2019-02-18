import crypto from 'crypto';
import sha3 from 'js-sha3';

const sha256 = sha3.sha3_256;

export const random = () => crypto.randomBytes(32);

export const base64ToBuffer = base64 => Buffer.from(base64, 'base64');
export const bufferToBase64 = buffer => buffer.toString('base64');

export const EDGE = base64ToBuffer('9NeOSRxG9JCQMxyjn8ne/oTHxiaQRfWp4mf96DRzpa0=');

export const hashString = string => Buffer.from(sha256.buffer(string));

export const hashList = list => {
  const hash = sha256.create();
  list.forEach(item => hash.update(item));
  return Buffer.from(hash.buffer());
};

export const hashEdge = (head, tail) => hashList([EDGE, head, tail]);
