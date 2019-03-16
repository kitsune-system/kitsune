import {
  base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E,
} from '../kitsune/hash';
import { COMMAND, LIST, SUPPORTS_COMMAND } from '../kitsune/nodes';

export const BasicSystem = commandObj => {
  const commands = { ...commandObj };

  const system = (commandId, args) => {
    const command = commands[b64(commandId)];

    if(!command)
      throw new Error(`No such command: ${commandId}`);

    return command(args);
  };

  system.commands = commands;
  system.add = (command, func) => (commands[command] = func);

  return system;
};

export const CommonSystem = commandObj => {
  const system = BasicSystem(commandObj);

  system.add(b64(SUPPORTS_COMMAND), commandId =>
    b64(commandId) in system.commands);
  system.add(b64(E(LIST, COMMAND)), () =>
    Object.keys(system.commands).map(key => buf(key)));

  return system;
};
