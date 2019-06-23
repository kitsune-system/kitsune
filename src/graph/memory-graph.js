import { BinaryMap, BinarySet, E } from '../common';

const MemoryGraph = () => {
  let count = 0;

  const edgeMap = BinaryMap();
  const headMap = BinaryMap();
  const tailMap = BinaryMap();

  const graph = {};

  graph.read = id => edgeMap(id);

  graph.heads = tail => {
    const set = tailMap(tail);
    return set ? set.clone() : BinarySet();
  };

  graph.tails = head => {
    const set = headMap(head);
    return set ? set.clone() : BinarySet();
  };

  graph.write = edge => {
    const [head, tail] = edge;

    const id = E(head, tail);
    if(edgeMap(id))
      return id;

    edgeMap(id, edge);

    const headIdx = headMap(head) || BinarySet();
    headIdx.add(tail);
    headMap(head, headIdx);

    const tailIdx = tailMap(tail) || BinarySet();
    tailIdx.add(head);
    tailMap(tail, tailIdx);

    count++;

    return id;
  };

  graph.erase = id => {
    if(!edgeMap(id))
      return undefined;

    const [head, tail] = edgeMap(id);
    edgeMap.delete(id);

    headMap(head).delete(tail);
    tailMap(tail).delete(head);

    count--;

    return [head, tail];
  };

  graph.count = () => count;
  graph.list = () => {
    const result = [];
    edgeMap((id, edge) => result.push(edge));
    return result;
  };

  return graph;
};

export default MemoryGraph;
