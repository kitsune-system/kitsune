import buildClient from './kitsune/client';
import {
  base64ToBuffer as buf, bufferToBase64 as b64, deepHashEdge as E,
} from './kitsune/hash';
import {
  CODE, HEAD, LIST, MAP_N, MAP_V, PIPE, RANDOM, READ,
  SET, TAIL, TO_BASE64, TO_BUFFER, WRITE,
} from './kitsune/nodes';

import './spec-common';

const client = buildClient('http://localhost:8080');

describe('integration specs', () => {
  it('`/random` should return 32 bytes string', async() => {
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

  it('should be able to write and read SETs', async() => {
    // WRITE SET
    let node = await client.wrap(
      E(WRITE, SET), [LIST, READ, WRITE].map(b64),
      [TO_BUFFER], [TO_BASE64],
    );
    node.should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // ORDER DOESN'T MATTER
    node = await client.wrap(
      E(WRITE, SET), [WRITE, LIST, READ].map(b64),
      [TO_BUFFER], [TO_BASE64],
    );
    node.should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // READ SET
    const set = await client.wrap(
      E(READ, SET), node,
      [TO_BUFFER], [TO_BASE64],
    );
    set.sort().should.deep.equal([LIST, READ, WRITE].map(b64).sort());
  });

  it('should be able to write and read MAP_Ns', async() => {
    let map = {
      [b64(READ)]: b64(HEAD),
      [b64(WRITE)]: b64(TAIL),
      [b64(RANDOM)]: b64(CODE),
    };

    // WRITE MAP_N
    const node = await client.wrap(
      E(WRITE, MAP_N), map,
      [TO_BUFFER], [TO_BASE64],
    );
    node.should.equal('6oypFkJKeMLFHqhF+X9XAq0k0QMq7/LVvnqYQcmU5tM=');

    // READ MAP_N
    map = await client.wrap(
      E(READ, MAP_N), node,
      [TO_BUFFER], [TO_BASE64],
    );
    map.should.deep.equal(map);
  });
});
