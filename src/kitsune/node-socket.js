import { Split } from '@gamedevfox/katana';

export const NodeSocket = webSocket => {
  const [input, output] = Split();

  const socket = msg => {
    const msgStr = JSON.stringify(msg);
    webSocket.send(msgStr);
  };

  webSocket.addEventListener('message', ({ data }) => {
    const msg = JSON.parse(data);
    input(msg);
  });

  socket.output = output;

  return socket;
};
