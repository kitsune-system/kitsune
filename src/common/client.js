import axios from 'axios';

import { bufferToBase64 as b64, deepHashEdge as E } from '../common/hash';
import { BASE64, BINARY, CONVERT, PIPE, RANDOM } from '../common/nodes';

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
    RANDOM, [],
    [], [E(CONVERT, [BINARY, BASE64])],
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
