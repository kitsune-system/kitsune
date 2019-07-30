import axios from 'axios';

import { bufferToBase64 as b64, deepHashEdge as E } from '../common/hash';
import {
  BASE64, BINARY, CONVERT, ERASE, EDGE, LIST_N, MAP_N, PIPE,
  RANDOM, READ, STRING, TO_BASE64, TO_BINARY, VARIABLE_GET, VARIABLE_SET, WRITE,
} from '../common/nodes';

const BIN2B64 = E(CONVERT, [BINARY, BASE64]);
const B642BIN = E(CONVERT, [BASE64, BINARY]);

export const KitsuneClient = (request, webSocket) => {
  webSocket.addEventListener('open', () => {
    console.log('Connected to WebSocket server...');
    webSocket.send('Hello');
  });
  webSocket.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    console.log('From Server:', msg);
  });

  const client = (command, input) => {
    if(typeof input !== 'object')
      input = JSON.stringify(input);

    return request.post(b64(command), input).then(response => response);
  };

  client.wrap = (command, input, before = [], after = []) => {
    const commandList = [...before, command, ...after].map(b64);
    const args = { commandList };

    if(input)
      args.input = input;

    return client(PIPE, args);
  };

  client.random = () => client.wrap(
    RANDOM, null, [], [BIN2B64],
  );

  // Edge
  client.writeEdge = (head, tail) => client.wrap(
    E(WRITE, EDGE), [head, tail], [TO_BINARY], [BIN2B64],
  );

  client.readEdge = edgeNode => client.wrap(
    E(READ, EDGE), edgeNode, [B642BIN], [TO_BASE64],
  );

  client.destroyEdge = edgeNode => client.wrap(
    E(ERASE, EDGE), edgeNode, [B642BIN], [],
  );

  // LIST
  client.writeList = list => client.wrap(
    E(WRITE, LIST_N), list, [TO_BINARY], [BIN2B64]
  );

  client.readList = listNode => client.wrap(
    E(READ, LIST_N), listNode, [B642BIN], [TO_BASE64]
  );

  // Map
  client.writeMap = map => client.wrap(
    E(WRITE, MAP_N), map, [TO_BINARY], [BIN2B64],
  );

  client.readMap = mapNode => client.wrap(
    E(READ, MAP_N), mapNode, [B642BIN], [TO_BASE64],
  );

  // String
  client.writeString = string => client.wrap(
    E(WRITE, STRING), string, [], [BIN2B64],
  );

  // Variable
  client.setVar = (varNode, valNode) => client.wrap(
    VARIABLE_SET, [varNode, valNode], [TO_BINARY], [BIN2B64],
  );

  client.getVar = varNode => client.wrap(
    VARIABLE_GET, varNode, [B642BIN], [BIN2B64],
  );

  return client;
};

const buildAxios = baseURL => {
  const result = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  result.interceptors.response.use(res => res.data);

  return result;
};

// EXPORT
export const build = config => {
  const wsProto = config.secure ? 'wss://' : 'ws://';
  const webProto = config.secure ? 'httsp://' : 'http://';

  const wsUrl = wsProto + config.kitsuneHost;
  const webUrl = webProto + config.kitsuneHost;

  const request = buildAxios(webUrl);
  const webSocket = new WebSocket(wsUrl);

  return KitsuneClient(request, webSocket);
};
