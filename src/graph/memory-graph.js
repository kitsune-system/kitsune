import { deepHashEdge as E } from '@kitsune-system/common';

const MemoryGraph = () => {
  let count = 0;

  const edgeMap = {};
  const headMap = {};
  const tailMap = {};

  const graph = {};

  graph.read = id => edgeMap[id];

  graph.heads = tail => {
    const set = tailMap[tail];
    return set ? new Set(set) : new Set();
  };

  graph.tails = head => {
    const set = headMap[head];
    return set ? new Set(set) : new Set();
  };

  graph.write = edge => {
    const [head, tail] = edge;

    const id = E(head, tail);
    if(edgeMap[id])
      return id;

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
    if(!edgeMap[id])
      return undefined;

    const [head, tail] = edgeMap[id];
    delete edgeMap[id];

    delete headMap[head][tail];
    delete tailMap[tail][head];

    count--;

    return [head, tail];
  };

  graph.count = () => count;
  graph.list = () => Object.values(edgeMap);

  return graph;
};

export default MemoryGraph;
