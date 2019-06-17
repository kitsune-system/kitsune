const mergeCall = (graphs, fnName) => id => {
  const result = new Set();
  graphs.forEach(graph => {
    graph[fnName](id).forEach(node => result.add(node));
  });
  return result;
};

const GraphUnion = graphs => {
  const union = {};

  union.count = () => graphs.reduce((count, graph) => count + graph.count(), 0);
  union.read = id => {
    for(const graph of graphs) {
      const edge = graph.read(id);
      if(edge)
        return edge;
    }

    return undefined;
  };

  union.heads = mergeCall(graphs, 'heads');
  union.tails = mergeCall(graphs, 'tails');

  return union;
};

export default GraphUnion;
