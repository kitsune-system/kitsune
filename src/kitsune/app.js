import { getNativeName } from './translate';

import { bufferToBase64 as b64, hashEdge as E, random } from '../kitsune/hash';
import { GET, NATIVE_NAME, RANDOM } from '../kitsune/nodes';
import { CommonSystem as System } from '../system/builder';
import { DB, EdgeCommands } from '../graph/edge-loki';

const db = DB();
const edges = db.getCollection('edges');
const edgeCommands = EdgeCommands(edges);

const app = System({
  [b64(RANDOM)]: random,
  [b64(E(GET, NATIVE_NAME))]: getNativeName,
  ...edgeCommands,
});

export default app;
