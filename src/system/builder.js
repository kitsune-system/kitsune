import {
  base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E,
} from '../common/hash';
import { COMMAND, LIST, SUPPORTS_COMMAND } from '../common/nodes';

export const wrap = binaryMap => (commandId, fn) => {
  const result = binaryMap(commandId, fn);

  if(commandId !== undefined && fn === undefined && !(b64(commandId) in binaryMap()))
    throw new Error(`There is no command for id: ${commandId.toString('base64')}`);

  return result;
};

export const BinaryMap = (base = {}) => {
  return (binaryKey, value) => {
    if(!binaryKey)
      return base;

    const keyStr = b64(binaryKey);
    if(!value)
      return base[keyStr];

    base[keyStr] = value;
  };
};

export const CommonSystem = commandObj => {
  const system = wrap(BinaryMap(commandObj));

  system(SUPPORTS_COMMAND, commandId => b64(commandId) in system());
  system(E(LIST, COMMAND), () => Object.keys(system()).map(key => buf(key)));

  return system;
};
