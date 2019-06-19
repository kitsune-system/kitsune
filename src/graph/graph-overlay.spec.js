import GraphOverlay from './graph-overlay';
import MemoryGraph from './memory-graph';
import { idFn } from './util.spec';

describe('GraphOverlay', () => {
  it('should work', () => {
    const baseGraph = MemoryGraph(idFn);
    baseGraph.write(['1', '2']);
    baseGraph.write(['1', '3']);
    baseGraph.write(['4', '5']);
    baseGraph.write(['6', '7']);

    const graph = GraphOverlay(baseGraph, { idFn });

    Array.from(baseGraph.heads('5')).should.have.members(['4']);
    Array.from(graph.heads('5')).should.have.members(['4']);
    Array.from(baseGraph.tails('1')).should.have.members(['2', '3']);
    Array.from(graph.tails('1')).should.have.members(['2', '3']);

    graph.write(['1', '9']);

    Array.from(baseGraph.tails('1')).should.have.members(['2', '3']);
    Array.from(graph.tails('1')).should.have.members(['2', '3', '9']);

    graph.erase('[1:2]');

    Array.from(baseGraph.tails('1')).should.have.members(['2', '3']);
    Array.from(graph.tails('1')).should.have.members(['3', '9']);
  });
});
