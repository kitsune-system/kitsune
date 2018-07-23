import Loki from 'lokijs';

import { hashEdge } from './hash';
import { EDGE, HEAD, READ, TAIL, WRITE } from './nodes';
import System from './system';
import { e } from './hash-local';

const LokiEdges = systemId => {
  const db = new Loki();
  const edges = db.addCollection('edge', {
    unique: ['id'],
    indicies: ['head', 'tail']
  });

  const system = System(systemId);

  system.command(e(WRITE, EDGE), ([head, tail]) => {
    const node = hashEdge(head, tail);

    const exists = (edges.by('id', node) !== undefined);
    if(!exists)
      edges.insert({ id: node, head, tail });

    return node;
  });

  system.command(e(READ, EDGE), node => {
    const result = edges.by('id', node);
    return [result.head, result.tail];
  });

  system.command(e(READ, HEAD), node => edges.find({ tail: node }).map(edge => edge.head));
  system.command(e(READ, TAIL), node => edges.find({ head: node }).map(edge => edge.tail));

  return system;
};

export default LokiEdges;
