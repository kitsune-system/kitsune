import { E, b64 } from '../common';
import { pseudoRandom } from '../common/hash';
import { RANDOM } from '../common/nodes';

import GraphUnion from './graph-union';
import MemoryGraph from './memory-graph';

it('GraphUnion', () => {
  const random = pseudoRandom(RANDOM);
  const nodes = [];
  for(let i = 0; i < 7; i++)
    nodes.push(random());

  const graphA = MemoryGraph();
  graphA.write([nodes[1], nodes[2]]);
  graphA.write([nodes[3], nodes[4]]);
  graphA.write([nodes[5], nodes[6]]);

  const graphB = MemoryGraph();
  graphB.write([nodes[1], nodes[3]]);
  graphB.write([nodes[5], nodes[6]]);

  const graphC = MemoryGraph();
  graphC.write([nodes[1], nodes[4]]);

  const union = GraphUnion([graphA, graphB, graphC]);

  union.read(E(nodes[1], nodes[4])).should.deep.equal([nodes[1], nodes[4]]);
  Array.from(union.heads(nodes[4]).toSet())
    .should.have.members([nodes[1], nodes[3]].map(b64));
  Array.from(union.tails(nodes[1]).toSet())
    .should.have.members([nodes[2], nodes[3], nodes[4]].map(b64));
});
