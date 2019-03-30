import axios from 'axios';

import { bufferToBase64 as b64, deepHashEdge as E } from '../common/hash';
import {
  BASE64, BINARY, CONVERT, EDGE, PIPE, RANDOM, STRING, TO_BINARY, WRITE,
} from '../common/nodes';

const BIN2B64 = E(CONVERT, [BINARY, BASE64]);

export const KitsuneClient = request => {
  const client = (command, input) => {
    if(typeof input !== 'object')
      input = JSON.stringify(input);

    return request.post(b64(command), input).then(response => response);
  };

  client.wrap = (command, input, before = [], after = []) => {
    const commandList = [...before, command, ...after].map(b64);
    return client(PIPE, { input, commandList });
  };

  client.random = () => client.wrap(
    RANDOM, null, [], [BIN2B64],
  );

  client.writeEdge = (head, tail) => client.wrap(
    E(WRITE, EDGE), [head, tail], [TO_BINARY], [BIN2B64]
  );

  client.writeString = string => client.wrap(
    E(WRITE, STRING), string, [], [BIN2B64],
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
const build = baseURL => {
  const request = buildAxios(baseURL);
  return KitsuneClient(request);
};
export default build;
