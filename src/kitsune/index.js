import { noOp } from '@gamedevfox/katana';
import { CORE } from '@kitsune-system/common';

import { App as Webapp } from '../web/app';
import { Servers } from '../web/server';
import { WebSocketServer } from '../web/web-socket-server';
import * as env from './env';

import { coreConfig as stringConfig } from '../data/sqlite3-string';
import { coreConfig as miscConfig } from './misc';

export const RUN = 'px2hlIWDJs6VthICIjWReP4f8d2r/MFQ6qwC6TKUF/Y=';

export const coreConfig = {
  ...stringConfig,
  ...miscConfig,

  [RUN]: {
    fn: ({ server, wss }) => () => {
      console.log('[[ INIT Kitsune ]]');
      console.log('Environment:', { ...env });

      server.listen();
      wss();
    },
    bind: { wss: 'WEB_SOCKET_SERVER' },
    inject: { server: 'SERVER' },
  },
  WEBAPP: {
    fn: ({ core }) => (_, output) => output(Webapp(core)),
    bind: { core: CORE },
  },
  SERVER: {
    fn: ({ webapp }) => (_, output) => output(Servers(webapp, env)),
    inject: { webapp: 'WEBAPP' },
  },
  WEB_SOCKET_SERVER: {
    fn: ({ core, server }) => (_, output = noOp) => {
      output(WebSocketServer({ core, server: server.server }));
    },
    bind: { core: CORE },
    inject: { server: 'SERVER' },
  },
};
