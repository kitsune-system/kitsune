import axios from 'axios';

import { bufferToBase64 as b64 } from './kitsune/hash';
import { RANDOM } from './kitsune/nodes';
import './spec-common';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

const call = (command, data) => api.post(b64(command), data);

describe('integration specs', () => {
  it('`/random` should return 32 bytes string', async() => {
    const result = await call(RANDOM);
    Buffer.from(result.data).length.should.equal(32);
  });

  it('PIPE command should chain command input and output together', async() => {
    const result = await call('BGbYmq/iTV8cUZ7WvhoeFlTgmYyGZAlPn7amkHgy4Rk=', // System - pipe
      {
        input: 'ijJv0As7V8Vk8kx1kL5Rm+LSDyHnfFPazUVtB/pmZiw=', // RANDOM
        commandList: [
          'Zz1KdFNhx0pcf6M1EHUD/UyzhFrguwH5LX5cpAF5Kv4=', // b64 to bin
          '4Y/SXeyS8y1YP4n+oercdBwh+FhDmhwTDWBdOsrjmQc=', // bin to b64
        ],
      }
    );

    result.data.should.equal('ijJv0As7V8Vk8kx1kL5Rm+LSDyHnfFPazUVtB/pmZiw=');
  });
});
