import {
  deepHashEdge as E, pseudoRandom, RANDOM,
} from '@kitsune-system/common';

import { GraphOverlay } from './graph-overlay';
import { MemoryGraph } from './memory-graph';

it('GraphOverlay', () => {
  const random = pseudoRandom(RANDOM);
  const nodes = [];
  for(let i = 0; i < 10; i++)
    nodes.push(random());

  const baseGraph = MemoryGraph();
  baseGraph.write([nodes[1], nodes[2]]);
  baseGraph.write([nodes[1], nodes[3]]);
  baseGraph.write([nodes[4], nodes[5]]);
  baseGraph.write([nodes[6], nodes[7]]);

  const graph = GraphOverlay(baseGraph);

  Array.from(baseGraph.heads(nodes[5])).should.have.members([nodes[4]]);
  Array.from(graph.heads(nodes[5])).should.have.members([nodes[4]]);
  Array.from(baseGraph.tails(nodes[1])).should.have.members([nodes[2], nodes[3]]);
  Array.from(graph.tails(nodes[1])).should.have.members([nodes[2], nodes[3]]);

  graph.write([nodes[1], nodes[9]]);

  Array.from(baseGraph.tails(nodes[1])).should.have.members([nodes[2], nodes[3]]);
  Array.from(graph.tails(nodes[1])).should.have.members([nodes[2], nodes[3], nodes[9]]);

  graph.erase(E(nodes[1], nodes[2]));

  Array.from(baseGraph.tails(nodes[1])).should.have.members([nodes[2], nodes[3]]);
  Array.from(graph.tails(nodes[1])).should.have.members([nodes[3], nodes[9]]);
});
