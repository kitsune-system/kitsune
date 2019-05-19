import { getNativeName } from './translate';

import {
  base64ToBuffer as buf, bufferToBase64 as b64,
  hashEdge as E, random,
} from '../common/hash';
import {
  BASE64, BINARY, CONVERT, GET, NATIVE_NAME, RANDOM,
  TO_BASE64, TO_BINARY, MAP_V, PIPE,
} from '../common/nodes';

const map = system => ({ input, mapCommand }) => input.map(
  item => system(buf(mapCommand))(item)
);

const pipe = system => ({ input, commandList }) => {
  commandList.forEach(command => {
    input = system(command)(input);
  });

  return input;
};

export const Commands = system => ({
  [b64(E(CONVERT, E(BASE64, BINARY)))]: buf,
  [b64(E(CONVERT, E(BINARY, BASE64)))]: b64,
  [b64(E(GET, NATIVE_NAME))]: getNativeName,
  [b64(RANDOM)]: () => b64(random()),

  // TODO: Replace
  [b64(TO_BASE64)]: nodes => {
    if(!nodes)
      return null;

    let result;
    if(Array.isArray(nodes))
      result = nodes.map(b64);
    else if(nodes.buffer)
      result = b64(nodes);
    else if(typeof nodes === 'object') {
      result = {};
      Object.entries(nodes).forEach(([key, value]) => (result[key] = b64(value)));
    } else
      throw new Error(`Can't convert ${nodes}`);
    return result;
  },

  [b64(TO_BINARY)]: nodes => {
    if(nodes === null)
      return null;

    let result;
    if(Array.isArray(nodes))
      result = nodes.map(buf);
    else if(typeof nodes === 'string')
      result = buf(nodes);
    else if(typeof nodes === 'object') {
      result = {};
      Object.entries(nodes).forEach(([key, value]) => (result[key] = buf(value)));
    } else
      throw new Error(`Can't convert ${nodes}`);
    return result;
  },

  [b64(MAP_V)]: map(system),
  [b64(PIPE)]: pipe(system),
});

export default Commands;
