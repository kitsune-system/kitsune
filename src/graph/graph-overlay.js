import MemoryGraph from './memory-graph';

const GraphOverlay = (baseGraph, { idFn } = {}) => {
  const writeGraph = MemoryGraph(idFn);
  const eraseGraph = MemoryGraph(idFn);

  const graph = {};

  graph.write = edge => {
    const id = idFn(...edge);

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

export default GraphOverlay;
