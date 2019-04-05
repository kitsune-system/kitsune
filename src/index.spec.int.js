import { expect } from 'chai';

import buildClient from './common/client';
import {
  base64ToBuffer as buf, bufferToBase64 as b64, deepHashEdge as E,
} from './common/hash';
import {
  CODE, HEAD, LIST, MAP_N, MAP_V, PIPE, RANDOM, READ,
  SET, TAIL, TO_BASE64, TO_BINARY, WRITE,
} from './common/nodes';

import './spec-common';

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

  it('should be able to write and read SETs', async() => {
    // WRITE SET
    let node = await client.wrap(
      E(WRITE, SET), [LIST, READ, WRITE].map(b64),
      [TO_BINARY], [TO_BASE64],
    );
    node.should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // ORDER DOESN'T MATTER
    node = await client.wrap(
      E(WRITE, SET), [WRITE, LIST, READ].map(b64),
      [TO_BINARY], [TO_BASE64],
    );
    node.should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // READ SET
    const set = await client.wrap(
      E(READ, SET), node,
      [TO_BINARY], [TO_BASE64],
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
      [TO_BINARY], [TO_BASE64],
    );
    node.should.equal('6oypFkJKeMLFHqhF+X9XAq0k0QMq7/LVvnqYQcmU5tM=');

    // READ MAP_N
    map = await client.wrap(
      E(READ, MAP_N), node,
      [TO_BINARY], [TO_BASE64],
    );
    map.should.deep.equal(map);
  });

  it('should be able to DESTROY EDGE', async() => {
    const id = 'sgUEYh5v7efV9OF74D+ga8DgNzeEbwWWdEmj3yg6hkQ=';

    const node = await client.writeEdge(b64(READ), b64(WRITE));
    node.should.equal(id);

    let edge = await client.readEdge(id);
    expect(edge).to.be.deep.equal([b64(READ), b64(WRITE), id]);

    await client.destroyEdge(id);

    edge = await client.readEdge(id);
    expect(edge).to.be.null;
  });

  it('should be able to SET and GET VARIABLES', async() => {
    const varNode = buf('+SIWMqU3rEvxfk9DhWzLFpbSu4JbEE8jQxxDoiZvBjo=');
    const valNodeA = buf('B+InkESxiB2N0HaLl/B6Ppko+aA38z4fW6AvYhbZrT4=');
    const valNodeB = buf('AkWArZ95nq1vXOoq/GppBzR4TIXaUnfc+KOuJxoE87s=');

    let edge = await client.setVar(varNode, valNodeA);
    edge.should.equal(b64(E(varNode, valNodeA)));

    let myVal = await client.getVar(b64(varNode));
    myVal.should.equal(b64(valNodeA));

    edge = await client.setVar(varNode, valNodeB);
    edge.should.equal(b64(E(varNode, valNodeB)));

    myVal = await client.getVar(varNode);
    myVal.should.equal(b64(valNodeB));
  });

  it('should be able to READ and WRITE a LIST', async() => {
    const list = [
      'SesKsezJ9L67JVvbZ+NWve+8yDK5Isy6GVuCtq7wNV4=',
      '8bCbJoxOn8PujH9uLWX8xqb+xw6XBLEzobQ/aiahYnY=',
      'WT1q120nPK7V3uJkOu+1XHYclnPawrB95tybJwGQBks=',
    ];

    let listNode = await client.writeList(list);
    listNode.should.equal('Pwyn6+nPw2AxIpaXHun28RmXw2JoAiTA9//hUMS8tTM=');

    let myList = await client.readList(listNode);
    myList.should.deep.equal(list);

    listNode = await client.writeList(list.slice().reverse());
    listNode.should.equal('QSLHYUgYV9EC5ZVYy0HItdhNPMvzIlUlA0usWB7ezxU=');

    myList = await client.readList(listNode);
    myList.should.deep.equal(list.slice().reverse());
  });
});
