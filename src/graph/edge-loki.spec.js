import { Builder } from '@gamedevfox/katana';
import {
  deepHashEdge as E, EDGE, WRITE, READ, ERASE,
} from '@kitsune-system/common';
import { expect } from 'chai';

import { config } from '../kitsune/builder';

describe('edge-loki', () => {
  it('should be able to WRITE EDGE', () => {
    const system = Builder(config)('system');

    const edge = system(E(WRITE, EDGE))([READ, WRITE]);
    edge.should.equal(E(READ, WRITE));
  });

  it('should be able to ERASE EDGE', async() => {
    const system = Builder(config)('system');

    const edgeNode = system(E(WRITE, EDGE))([READ, WRITE]);
    let edge = system(E(READ, EDGE))(edgeNode);
    expect(edge).to.be.deep.equal([READ, WRITE, edgeNode]);

    system(E(ERASE, EDGE))(edgeNode);

    edge = system(E(READ, EDGE))(edgeNode);
    expect(edge).to.be.null;
  });
});
