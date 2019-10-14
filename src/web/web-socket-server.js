import { WebSocketSystem } from '@kitsune-system/common';
import WebSocket from 'ws';

import { NodeSocket } from '../kitsune/node-socket';

export const WebSocketServer = ({ core, server }) => {
  let idCounter = 0;
  const sessions = {};

  const wss = new WebSocket.Server({ server });

  wss.on('connection', webSocket => {
    const id = ++idCounter;
    const socket = NodeSocket(webSocket);
    const system = WebSocketSystem({ core, socket });

    const session = { id, socket, system };
    sessions[id] = session;

    webSocket.on('close', () => delete sessions[id]);

    socket({ id, yourMom: 'is-the-bomb' });
    system('SET_MY_ID', setMyId => {
      console.log('SEND CONNECT CLIENT ID:', id);
      setMyId(id, value => {
        console.log('It came back >>', value);
      });
    });
  });

  return id => sessions[id];
};
