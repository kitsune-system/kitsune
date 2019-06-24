import { Builder, config } from './kitsune/builder';
import Webapp from './web/app';
import createAndListen from './web/server';
import WebSocketServer from './web/web-socket';

// Config
const {
  KITSUNE_HTTP_PORT,
  KITSUNE_HTTPS_PORT: securePort,
  KITSUNE_SERVER_NAME: serverName,
} = process.env;

const insecurePort = KITSUNE_HTTP_PORT || 8080;

const system = Builder(config)('system');
const webapp = Webapp(system);

const { server, listen } = createAndListen(webapp, {
  serverName, securePort, insecurePort,
});

WebSocketServer(server);

listen();
