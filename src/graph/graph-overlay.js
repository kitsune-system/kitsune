import { deepHashEdge as E } from '@kitsune-system/common';

import { MemoryGraph } from './memory-graph';

export const GraphOverlay = baseGraph => {
  const writeGraph = MemoryGraph();
  const eraseGraph = MemoryGraph();

  const graph = {};

  graph.write = edge => {
    const id = E(...edge);

    eraseGraph.erase(id);
    writeGraph.write(edge);

    return id;
  };

  graph.erase = id => {
    const edge = graph.read(id);

    writeGraph.erase(id);
    eraseGraph.write(edge);

    return edge;
  };

  graph.read = id => {
    let edge = writeGraph.read(id);
    if(!edge) {
      if(eraseGraph.read(id))
        return undefined;

      edge = baseGraph.read(id);
    }

    return edge;
  };

  const metaOp = opName => node => {
    const nodes = baseGraph[opName](node);
    eraseGraph[opName](node).forEach(n => nodes.delete(n));
    writeGraph[opName](node).forEach(n => nodes.add(n));
    return nodes;
  };

  graph.heads = metaOp('heads');
  graph.tails = metaOp('tails');

  return graph;
};
