import { base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E } from '../common/hash';

const resultToEdge = result => [buf(result.head), buf(result.tail), buf(result.id)];

const LokiGraph = edges => {
  const graph = {};

  graph.read = id => {
    const result = edges.by('id', b64(id));
    return result ? resultToEdge(result) : null;
  };

  graph.heads = tail => edges.find({ tail: b64(tail) }).map(row => buf(row.head));
  graph.tails = head => edges.find({ head: b64(head) }).map(row => buf(row.tail));

  graph.write = edge => {
    const [head, tail] = edge;

    const node = E(head, tail);

    const id = b64(node);
    const exists = (edges.by('id', id) !== undefined);
    if(!exists)
      edges.insert({ id, head: b64(head), tail: b64(tail) });

    return node;
  };

  graph.erase = id => edges.findAndRemove({ id: b64(id) });

  graph.list = () => edges.find().map(resultToEdge);

  return graph;
};

export default LokiGraph;
