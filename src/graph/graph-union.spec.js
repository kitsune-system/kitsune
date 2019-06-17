import GraphUnion from './graph-union';
import MemoryGraph from './memory-graph';

describe('GraphUnion', () => {
  it('should work', () => {
    const graphA = MemoryGraph();
    graphA.write(['1', '2']);
    graphA.write(['3', '4']);
    graphA.write(['5', '6']);

    const graphB = MemoryGraph();
    graphB.write(['1', '3']);
    graphB.write(['5', '6']);

    const graphC = MemoryGraph();
    graphC.write(['1', '4']);

    const union = GraphUnion([graphA, graphB, graphC]);

    // TODO: What do we do about duplicate edges
    union.count().should.equal(6);
    // union.uniqueCount().should.equal(5);
    union.read('[1:4]').should.deep.equal(['1', '4']);
    Array.from(union.heads('4')).should.deep.include.members(['1', '3']);
    Array.from(union.tails('1')).should.deep.include.members(['2', '3', '4']);
  });
});
