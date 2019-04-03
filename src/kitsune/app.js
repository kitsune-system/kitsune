import { getNativeName } from './translate';

import {
  base64ToBuffer as buf, bufferToBase64 as b64,
  hashEdge as E, random,
} from '../common/hash';
import {
  BASE64, BINARY, CONVERT, GET, MAP_V, NATIVE_NAME,
  PIPE, RANDOM, TO_BASE64, TO_BINARY,
} from '../common/nodes';
import { CommonSystem as System } from '../system/builder';

import CodeCommands from '../code/native';
import StringCommands from '../data/string-loki';
import { DB, EdgeCommands } from '../graph/edge-loki';
import MapCommands from '../struct/map';
import SetCommands from '../struct/set';
import VariableCommands from '../struct/variable';

const db = DB();
const [edges, strings] = ['edges', 'strings']
  .map(name => db.getCollection(name));

const edgeCommands = EdgeCommands(edges);
const stringCommands = StringCommands(strings);

const map = system => ({ input, mapCommand }) => input.map(item => system(buf(mapCommand), item));

const pipe = system => ({ input, commandList }) => {
  commandList.forEach(command => {
    input = system(command, input);
  });

  return input;
};

const app = System({
  [b64(E(CONVERT, E(BASE64, BINARY)))]: buf,
  [b64(E(CONVERT, E(BINARY, BASE64)))]: b64,
  [b64(E(GET, NATIVE_NAME))]: getNativeName,
  [b64(RANDOM)]: random,

  // TODO: Replace
  [b64(TO_BASE64)]: nodes => {
    if(nodes === null)
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

  ...edgeCommands,
  ...stringCommands,
});

const addCommands = (system, commands) => {
  Object.entries(commands).forEach(([key, value]) => system.add(key, value));
};

addCommands(app, CodeCommands(app));
addCommands(app, MapCommands(app));
addCommands(app, SetCommands(app));
addCommands(app, VariableCommands(app));

app.add(b64(MAP_V), map(app));
app.add(b64(PIPE), pipe(app));

export default app;
