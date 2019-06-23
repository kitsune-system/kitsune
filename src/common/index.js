import ArgCountSwitch from './arg-count-switch';
import BinaryMap from './binary-map';
import BinarySet from './binary-set';
import { base64ToBuffer as buf, bufferToBase64 as b64, deepHashEdge as E } from './hash';

export const toBinaryObject = (...entries) => {
  const result = {};
  entries.forEach(([key, value]) => {
    result[b64(key)] = value;
  });
  return result;
};

export {
  ArgCountSwitch, BinaryMap, BinarySet, E,
  b64, buf, toBinaryObject as toBinObj,
};
