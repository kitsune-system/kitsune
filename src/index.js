import { bufferToBase64 as b64, deepHashEdge as E } from './common/hash';
import * as N from './common/nodes';
import app from './kitsune/app';
import Webapp from './web/app';
import createAndListen from './web/server';

const nodeMap = {};
Object.entries(N).forEach(([key, value]) => {
  const stringNode = app(E(N.WRITE, N.STRING), key);
  nodeMap[b64(stringNode)] = value;
});

const nodeMapId = app(E(N.WRITE, N.MAP_N), nodeMap);
app(E(N.WRITE, N.EDGE), [N.BUILT_IN_NODES, nodeMapId]);

// Config
const {
  KITSUNE_ON_STARTED: onStarted,
  KITSUNE_HTTP_PORT,
  KITSUNE_HTTPS_PORT: securePort,
  KITSUNE_SERVER_NAME: serverName,
} = process.env;

const insecurePort = KITSUNE_HTTP_PORT || 8080;

const webapp = Webapp(app);
createAndListen(webapp, { serverName, securePort, insecurePort, onStarted });
