import { base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as e } from '../kitsune/hash';
import { COMMAND, LIST, SUPPORTS_COMMAND } from '../kitsune/nodes';

export const BasicSystem = commandObj => {
  return (commandId, args) => {
    const command = commandObj[b64(commandId)];

    if(!command)
      throw new Error(`No such command: ${commandId}`);

    return command(args);
  };
};

export const CommonSystem = commandObj => {
  const extendedCommandObj = {
    ...commandObj,
    [b64(SUPPORTS_COMMAND)]: commandId => b64(commandId) in extendedCommandObj,
    [b64(e(LIST, COMMAND))]: () => Object.keys(extendedCommandObj)
      .map(key => buf(key)),
  };
  return BasicSystem(extendedCommandObj);
};
