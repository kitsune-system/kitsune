import { build as buildClient } from './common/client';
import { base64ToBuffer as buf, bufferToBase64 as b64 } from './common/hash';
import { PIPE, RANDOM, MAP_V } from './common/nodes';

const client = buildClient('http://localhost:8080');
describe('integration specs', () => {
  it('RANDOM should return 32 bytes string', async() => {
    const result = await client.random();
    Buffer.from(buf(result)).length.should.equal(32);
  });

  it('PIPE command should chain command input and output together', async() => {
    const result = await client(PIPE, {
      input: RANDOM, // RANDOM
      commandList: [
        'Zz1KdFNhx0pcf6M1EHUD/UyzhFrguwH5LX5cpAF5Kv4=', // b64 to bin
        '4Y/SXeyS8y1YP4n+oercdBwh+FhDmhwTDWBdOsrjmQc=', // bin to b64
      ],
    });

    result.should.equal(b64(RANDOM));
  });

  it('MAP_V command should transform each element of an array', async() => {
    const result = await client(MAP_V, {
      input: [RANDOM, PIPE, MAP_V].map(b64),
      mapCommand: '4Y/SXeyS8y1YP4n+oercdBwh+FhDmhwTDWBdOsrjmQc=',
    });
    result.should.deep.equal([RANDOM, PIPE, MAP_V].map(b64));
  });
});
