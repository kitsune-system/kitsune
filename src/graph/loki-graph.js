import { deepHashEdge as E } from '@kitsune-system/common';

const resultToEdge = result => [result.head, result.tail, result.id];

const LokiGraph = edges => {
  const graph = {};

  graph.read = id => {
    const result = edges.by('id', id);
    return result ? resultToEdge(result) : null;
  };

  graph.heads = tail => edges.find({ tail }).map(row => row.head);
  graph.tails = head => edges.find({ head }).map(row => row.tail);

  graph.write = edge => {
    const [head, tail] = edge;

    const node = E(head, tail);

    const id = node;
    const exists = (edges.by('id', id) !== undefined);
    if(!exists)
      edges.insert({ id, head, tail });

    return node;
  };

  graph.erase = id => edges.findAndRemove({ id });

  graph.list = () => edges.find().map(resultToEdge);

  return graph;
};

export default LokiGraph;
