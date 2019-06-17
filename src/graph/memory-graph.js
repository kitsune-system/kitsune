const idFn = (head, tail) => `[${head}:${tail}]`;

const MemoryGraph = () => {
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
  };

  graph.erase = id => {
    if(!(id in edgeMap))
      throw new Error(`No such edge for id: ${id}`);

    const [head, tail] = edgeMap[id];
    delete edgeMap[id];

    headMap[head].delete(tail);
    tailMap[tail].delete(head);

    count--;
  };

  graph.count = () => count;
  graph.list = () => Object.values(edgeMap);

  graph.read = id => edgeMap[id];
  graph.heads = tail => tailMap[tail] || new Set();
  graph.tails = head => headMap[head] || new Set();

  return graph;
};

export default MemoryGraph;
