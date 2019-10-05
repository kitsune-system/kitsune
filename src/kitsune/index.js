import { Builder } from '@gamedevfox/katana';

import { config } from './config';
import * as env from './env';

export const build = Builder(config);

const initialLogging = () => {
  console.log('[[INIT Kitsune]]');
  console.log('Environment:', { ...env });
};

const bindWebServer = () => {
  // Ensure WebSocketServer is bound to server
  build('webSocketServer');

  build('serverAndListen').listen();
};

export const run = () => ([initialLogging, bindWebServer].forEach(fn => fn()));
