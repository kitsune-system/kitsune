import WebSocket from 'ws';

export const WebSocketServer = ({ server, handler }) => {
  let idCounter = 0;
  const sessions = {};

  const wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    const id = ++idCounter;
    const send = msg => ws.send(JSON.stringify(msg));

    const session = { id, ws, send };
    sessions[id] = session;

    ws.on('message', msg => handler(msg, session));
    ws.on('close', () => delete sessions[id]);

    send({ id });
  });

  return id => sessions[id];
};
