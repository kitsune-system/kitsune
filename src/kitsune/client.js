import axios from 'axios';

import { bufferToBase64 as b64 } from '../kitsune/hash';

export const KitsuneClient = request => {
  const client = (command, input) => {
    if(typeof input !== 'object')
      input = JSON.stringify(input);

    return request.post(b64(command), input).then(response => response);
  };

  client.wrap = (command, input, before = [], after = []) => {
    const commandList = [...before, command, ...after].map(b64);
    return client(
      'BGbYmq/iTV8cUZ7WvhoeFlTgmYyGZAlPn7amkHgy4Rk=', // PIPE
      { input, commandList }
    );
  };

  client.random = () => client.wrap(
    'ijJv0As7V8Vk8kx1kL5Rm+LSDyHnfFPazUVtB/pmZiw=', [], // RANDOM
    [], ['4Y/SXeyS8y1YP4n+oercdBwh+FhDmhwTDWBdOsrjmQc='], // bin to b64
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
