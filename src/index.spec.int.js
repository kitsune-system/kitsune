import axios from 'axios';

import { bufferToBase64 as b64 } from './kitsune/hash';
import { MAP, PIPE, RANDOM } from './kitsune/nodes';
import './spec-common';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.response.use(res => res.data);

const call = (command, data) => api.post(b64(command), data);

describe('integration specs', () => {
  it('`/random` should return 32 bytes string', async() => {
    const result = await call(RANDOM);
    Buffer.from(result.data).length.should.equal(32);
  });

  it('PIPE command should chain command input and output together', async() => {
    const result = await call(PIPE, {
      input: RANDOM, // RANDOM
      commandList: [
        'Zz1KdFNhx0pcf6M1EHUD/UyzhFrguwH5LX5cpAF5Kv4=', // b64 to bin
        '4Y/SXeyS8y1YP4n+oercdBwh+FhDmhwTDWBdOsrjmQc=', // bin to b64
      ],
    });

    result.should.equal(b64(RANDOM));
  });

  it('MAP command should transform each element of an array', async() => {
    const result = await call(MAP, {
      input: [b64(RANDOM), b64(PIPE), b64(MAP)],
      mapCommand: '4Y/SXeyS8y1YP4n+oercdBwh+FhDmhwTDWBdOsrjmQc=',
    });
    result.should.deep.equal([b64(RANDOM), b64(PIPE), b64(MAP)]);
  });
});
