import { Map } from '@gamedevfox/katana';
import {
  deepHashEdge as E,
  EDGE, ERASE, READ, WRITE, LIST_EDGES, LIST_HEADS, LIST_TAILS,
} from '@kitsune-system/common';

const resultToEdge = result => [result.head, result.tail, result.id];

export const commands = Map();

commands(E(WRITE, EDGE), ({ edges }) => ([head, tail]) => {
  const id = E(head, tail);

  const exists = (edges.by('id', id) !== undefined);
  if(!exists)
    edges.insert({ id, head, tail });

  return id;
});

commands(E(READ, EDGE), ({ edges }) => id => {
  const result = edges.by('id', id);
  return result ? resultToEdge(result) : null;
});

commands(E(ERASE, EDGE), ({ edges }) => id => edges.findAndRemove({ id }));

commands(LIST_EDGES, ({ edges }) => id => edges.findAndRemove({ id }));
commands(LIST_HEADS, ({ edges }) => tail => edges.find({ tail }).map(row => row.head));
commands(LIST_TAILS, ({ edges }) => head => edges.find({ head }).map(row => row.tail));

export const LokiGraph = ({ edges }) => {
  const graph = {};

  graph.write = edge => {
    const [head, tail] = edge;

    const node = E(head, tail);

    const id = node;
    const exists = (edges.by('id', id) !== undefined);
    if(!exists)
      edges.insert({ id, head, tail });

    return node;
  };

  graph.read = id => {
    const result = edges.by('id', id);
    return result ? resultToEdge(result) : null;
  };

  graph.erase = id => edges.findAndRemove({ id });

  graph.list = () => edges.find().map(resultToEdge);
  graph.heads = tail => edges.find({ tail }).map(row => row.head);
  graph.tails = head => edges.find({ head }).map(row => row.tail);

  return graph;
};
