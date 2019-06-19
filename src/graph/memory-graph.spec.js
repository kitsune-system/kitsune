import { expect } from 'chai';

import MemoryGraph from './memory-graph';
import { idFn } from './util.spec';

describe('MemoryGraph', () => {
  it('should work', () => {
    const graph = MemoryGraph(idFn);

    for(let i = 0; i < 20; i++) {
      const head = (i % 7) + 3;
      const tail = i % 13;
      const edge = [head, tail];
      graph.write(edge);
    }

    graph.count().should.equal(20);

    const edge = graph.list()[10];
    edge.should.deep.equal([6, 10]);

    const id = `[${edge[0]}:${edge[1]}]`;
    graph.read(id).should.deep.equal(edge);

    Array.from(graph.heads('2')).should.have.members([4, 5]);
    Array.from(graph.heads('11')).should.have.members([7]);

    graph.erase(id);

    graph.count().should.equal(19);

    expect(graph.read('[123:456]')).to.be.undefined;
  });
});
