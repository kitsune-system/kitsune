import _ from 'lodash';

import { e, random } from './hash';
import LokiEdges from './loki-edges';
import { EDGE, GROUP, HEAD, LIST, READ, SYSTEM, TAIL, WRITE } from './nodes';

const [ALPHA, BETA, DELTA, OMEGA] = _.times(4, random);

describe('LokiEdges', () => {
  let system;

  beforeEach(() => {
    system = LokiEdges(e(EDGE, SYSTEM));
  });

  it('should write and read edges', () => {
    const nodeA = system(e(WRITE, EDGE), ['hello', 'world']);
    const nodeB = system(e(WRITE, EDGE), ['abc', 'def']);
    const nodeC = system(e(WRITE, EDGE), ['last', 'one']);

    nodeA.should.equal('84RiPzn+f3mOcudEpV370/TF4nCgcOZNWWnf1jtAyUY=');
    nodeB.should.equal('eFR6EaEniy34acp61wDU1DJewanHz0fD8CzUThzIQVg=');
    nodeC.should.equal('dHOLBiXdO1T0gD/9PiXIT/m6tPcnp8b5GOVSlR4SBBI=');

    const result = system(e(READ, EDGE), nodeA);
    result.should.deep.equal(['hello', 'world']);
  });

  it('should be able to write same edge, returning the same result', () => {
    let node = system(e(WRITE, EDGE), [LIST, GROUP]);
    node.should.equal('oZlRxHjcOOhsLZdcSppmuixN1xkd2A5ZZo3sPlMv5tA=');

    node = system(e(WRITE, EDGE), [LIST, GROUP]);
    node.should.equal('oZlRxHjcOOhsLZdcSppmuixN1xkd2A5ZZo3sPlMv5tA=');

    const edge = system(e(READ, EDGE), node);
    edge.should.deep.equal([LIST, GROUP]);
  });

  it('should be able to get HEADs and TAILs', () => {
    system(e(WRITE, EDGE), [ALPHA, BETA]);
    system(e(WRITE, EDGE), [ALPHA, DELTA]);
    system(e(WRITE, EDGE), [DELTA, OMEGA]);

    system(e(READ, HEAD), ALPHA).should.deep.equal([]);
    system(e(READ, HEAD), BETA).should.deep.contain(ALPHA);
    system(e(READ, HEAD), DELTA).should.deep.contain(ALPHA);
    system(e(READ, HEAD), OMEGA).should.deep.contain(DELTA);

    system(e(READ, TAIL), ALPHA).should.deep.contains(BETA, DELTA);
    system(e(READ, TAIL), BETA).should.deep.equal([]);
    system(e(READ, TAIL), DELTA).should.deep.contains(OMEGA);
    system(e(READ, TAIL), OMEGA).should.deep.equal([]);
  });
});
