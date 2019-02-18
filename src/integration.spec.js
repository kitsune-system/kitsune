import axios from 'axios';

import { bufferToBase64 as b64 } from './kitsune/hash';
import { RANDOM } from './kitsune/nodes';
import './spec-common';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

const call = command => api.get(b64(command));

describe('integration specs', () => {
  it('random should return 32 bytes string', async() => {
    const result = await call(RANDOM);
    Buffer.from(result.data).length.should.equal(32);
  });
});
