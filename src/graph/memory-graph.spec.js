import { expect } from 'chai';

import { E, b64 } from '../common';
import { pseudoRandom } from '../common/hash';
import { RANDOM } from '../common/nodes';

import MemoryGraph from './memory-graph';

it('MemoryGraph', () => {
  const random = pseudoRandom(RANDOM);
  const nodes = [];
  for(let i = 0; i < 5; i++)
    nodes.push(random());

  const graph = MemoryGraph();

  for(let i = 0; i < 20; i++) {
    const head = nodes[i % 5];
    const tail = nodes[Math.floor(i * 13 / 7) % 5];

    const edge = [head, tail];
    graph.write(edge);
  }

  graph.count().should.equal(16);

  const edge = graph.list()[2];
  edge.map(b64).should.deep.equal([nodes[2], nodes[3]].map(b64));

  const id = E(edge[0], edge[1]);
  graph.read(id).should.deep.equal(edge);

  Array.from(graph.heads(nodes[0]).toSet())
    .should.have.members([nodes[0], nodes[3], nodes[1], nodes[4]].map(b64));
  Array.from(graph.heads(nodes[1]).toSet())
    .should.have.members([nodes[1], nodes[4], nodes[2]].map(b64));

  const removedEdge = graph.erase(id);
  removedEdge.map(b64).should.deep.equal([nodes[2], nodes[3]].map(b64));

  graph.count().should.equal(15);

  expect(graph.read(RANDOM)).to.be.undefined;
});
