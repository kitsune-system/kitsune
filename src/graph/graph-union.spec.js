import GraphUnion from './graph-union';
import MemoryGraph from './memory-graph';
import { idFn } from './util.spec';

describe('GraphUnion', () => {
  it('should work', () => {
    const graphA = MemoryGraph(idFn);
    graphA.write(['1', '2']);
    graphA.write(['3', '4']);
    graphA.write(['5', '6']);

    const graphB = MemoryGraph(idFn);
    graphB.write(['1', '3']);
    graphB.write(['5', '6']);

    const graphC = MemoryGraph(idFn);
    graphC.write(['1', '4']);

    const union = GraphUnion([graphA, graphB, graphC]);

    union.read('[1:4]').should.deep.equal(['1', '4']);
    Array.from(union.heads('4')).should.have.members(['1', '3']);
    Array.from(union.tails('1')).should.have.members(['2', '3', '4']);
  });
});
