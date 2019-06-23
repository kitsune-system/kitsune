import { E, b64 } from '../common';
import { pseudoRandom } from '../common/hash';
import { RANDOM } from '../common/nodes';

import GraphOverlay from './graph-overlay';
import MemoryGraph from './memory-graph';

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

  Array.from(baseGraph.heads(nodes[5]).toSet()).should.have.members([nodes[4]].map(b64));
  Array.from(graph.heads(nodes[5]).toSet()).should.have.members([nodes[4]].map(b64));
  Array.from(baseGraph.tails(nodes[1]).toSet()).should.have.members([nodes[2], nodes[3]].map(b64));
  Array.from(graph.tails(nodes[1]).toSet()).should.have.members([nodes[2], nodes[3]].map(b64));

  graph.write([nodes[1], nodes[9]]);

  Array.from(baseGraph.tails(nodes[1]).toSet()).should.have.members([nodes[2], nodes[3]].map(b64));
  Array.from(graph.tails(nodes[1]).toSet()).should.have.members([nodes[2], nodes[3], nodes[9]].map(b64));

  graph.erase(E(nodes[1], nodes[2]));

  Array.from(baseGraph.tails(nodes[1]).toSet()).should.have.members([nodes[2], nodes[3]].map(b64));
  Array.from(graph.tails(nodes[1]).toSet()).should.have.members([nodes[3], nodes[9]].map(b64));
});
