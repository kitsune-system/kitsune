const MemoryGraph = idFn => {
  let count = 0;

  const edgeMap = {};
  const headMap = {};
  const tailMap = {};

  const graph = {};

  graph.write = edge => {
    const [head, tail] = edge;

    const id = idFn(head, tail);
    edgeMap[id] = edge;

    const headIdx = headMap[head] || new Set();
    headIdx.add(tail);
    headMap[head] = headIdx;

    const tailIdx = tailMap[tail] || new Set();
    tailIdx.add(head);
    tailMap[tail] = tailIdx;

    count++;

    return id;
  };

  graph.erase = id => {
    if(!(id in edgeMap))
      return undefined;

    const [head, tail] = edgeMap[id];
    delete edgeMap[id];

    headMap[head].delete(tail);
    tailMap[tail].delete(head);

    count--;

    return [head, tail];
  };

  graph.count = () => count;
  graph.list = () => Object.values(edgeMap);

  graph.read = id => edgeMap[id];
  graph.heads = tail => new Set(tailMap[tail]);
  graph.tails = head => new Set(headMap[head]);

  return graph;
};

export default MemoryGraph;
