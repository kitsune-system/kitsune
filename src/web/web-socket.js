import WebSocket from 'ws';

const WebSocketServer = server => {
  let idCounter = 0;
  const sessions = new Map();

  const wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    console.log('CLIENT CONNECTED');

    const id = ++idCounter;
    sessions.set(ws, { id, count: 0 });

    const sessionCount = sessions.size;
    ws.on('message', msg => {
      console.log('MESSAGE:', msg);

      const session = sessions.get(ws);

      session.count++;

      ws.send(`Session Count: ${sessionCount}`);
      ws.send(JSON.stringify(session, null, 2));
    });

    ws.on('close', () => {
      console.log('CLIENT DISCONNECTED');
      sessions.delete(ws);
    });

    ws.send('something');
  });

  return wss;
};

export default WebSocketServer;
