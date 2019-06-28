import WebSocket from 'ws';

const WebSocketServer = ({ server, handler }) => {
  let idCounter = 0;
  const sessions = {};

  const wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    console.log('CLIENT CONNECTED');

    const id = ++idCounter;
    const send = msg => ws.send(JSON.stringify(msg));

    const session = {
      id, ws, send,
      count: 0,
    };

    sessions[id] = session;

    ws.on('message', msg => {
      console.log('MESSAGE:', msg);

      const res = handler(msg, session);
      send(res);
    });

    ws.on('close', () => {
      console.log('CLIENT DISCONNECTED');
      delete sessions[id];
    });

    send('something');
  });

  return id => sessions[id];
};

export default WebSocketServer;
