import WebSocket from 'ws';

const WebSocketServer = server => {
  const sessions = new Map();

  const wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    console.log('CONNECTION');
    sessions.set(ws, { count: 0 });

    const sessionCount = sessions.size;
    ws.on('message', msg => {
      console.log('MESSAGE:', msg);
      console.log(`Msg: ${msg}`);

      console.log(Object.keys(ws));

      const session = sessions.get(ws);

      session.count++;
      ws.send(`Count: ${session.count}`);
      ws.send(`Session Count: ${sessionCount}`);
    });

    ws.on('close', () => {
      console.log('Disconnected');

      sessions.delete(ws);

      console.log('D', sessions);
    });

    ws.send('something');
  });

  return wss;
};

export default WebSocketServer;
