import { getNativeName } from './translate';

import {
  base64ToBuffer as buf, bufferToBase64 as b64,
  hashEdge as E, random,
} from '../kitsune/hash';
import {
  BASE64, BINARY, CONVERT, GET, MAP, NATIVE_NAME, PIPE, RANDOM,
} from '../kitsune/nodes';
import { CommonSystem as System } from '../system/builder';
import { DB, EdgeCommands } from '../graph/edge-loki';
import StringCommands from '../data/string-loki';

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
  ...edgeCommands,
  ...stringCommands,
});

app.add(b64(MAP), map(app));
app.add(b64(PIPE), pipe(app));

export default app;
