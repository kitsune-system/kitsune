import {
  base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E,
} from '../common/hash';
import { COMMAND, LIST, SUPPORTS_COMMAND } from '../common/nodes';

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
  const system = BinaryMap(commandObj);

  system(SUPPORTS_COMMAND, commandId => b64(commandId) in system());
  system(E(LIST, COMMAND), () => Object.keys(system()).map(key => buf(key)));

  return system;
};
