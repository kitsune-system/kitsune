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

export const CommandSystem = commandObj => {
  const system = BinaryMap(commandObj);

  system(SUPPORTS_COMMAND, commandId => b64(commandId) in system());
  system(E(LIST, COMMAND), () => Object.keys(system()).map(key => buf(key)));

  return system;
};

export const BasicSystem = commandObj => {
  const commands = { ...commandObj };

  const system = (commandId, args) => {
    const command = commands[b64(commandId)];

    if(!command)
      throw new Error(`No such command: ${commandId}`);

    return command(args);
  };

  system.commands = commands;
  system.add = (commandId, func) => (commands[commandId] = func);

  return system;
};

export const CommonSystem = commandObj => {
  const system = BasicSystem(commandObj);

  system.add(b64(SUPPORTS_COMMAND), commandId => b64(commandId) in system.commands);
  system.add(b64(E(LIST, COMMAND)), () => Object.keys(system.commands).map(key => buf(key)));

  return system;
};
