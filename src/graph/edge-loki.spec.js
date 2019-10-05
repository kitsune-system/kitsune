import {
  deepHashEdge as E, EDGE, WRITE, READ, ERASE,
} from '@kitsune-system/common';
import { expect } from 'chai';

import { build } from '../kitsune';

describe('edge-loki', () => {
  it('should be able to WRITE EDGE', () => {
    const system = build('system');

    const edge = system(E(WRITE, EDGE))([READ, WRITE]);
    edge.should.equal(E(READ, WRITE));
  });

  it('should be able to ERASE EDGE', async() => {
    const system = build('system');

    const edgeNode = system(E(WRITE, EDGE))([READ, WRITE]);
    let edge = system(E(READ, EDGE))(edgeNode);
    expect(edge).to.be.deep.equal([READ, WRITE, edgeNode]);

    system(E(ERASE, EDGE))(edgeNode);

    edge = system(E(READ, EDGE))(edgeNode);
    expect(edge).to.be.null;
  });
});
