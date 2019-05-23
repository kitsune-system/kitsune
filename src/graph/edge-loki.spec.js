import { expect } from 'chai';

import { bufferToBase64 as b64, hashEdge as E } from '../common/hash';
import { EDGE, WRITE, READ, DESTROY } from '../common/nodes';
import { Builder, config } from '../kitsune/builder';

describe('edge-loki', () => {
  it('should be able to WRITE EDGE', () => {
    const system = Builder(config)('system');

    const edge = system(E(WRITE, EDGE))([READ, WRITE]);
    b64(edge).should.equal(b64(E(READ, WRITE)));
  });

  it('should be able to DESTROY EDGE', async() => {
    const system = Builder(config)('system');

    const edgeNode = system(E(WRITE, EDGE))([READ, WRITE]);
    let edge = system(E(READ, EDGE))(edgeNode);
    expect(edge.map(b64)).to.be.deep.equal([READ, WRITE, edgeNode].map(b64));

    system(E(DESTROY, EDGE))(edgeNode);

    edge = system(E(READ, EDGE))(edgeNode);
    expect(edge).to.be.null;
  });
});
