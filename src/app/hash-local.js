import _ from 'lodash';

import { hash, hashEdge, simpleHashEdge } from './hash';
import * as nodes from './nodes';
import MemoryEdges from './memory-edges';
import edgeNodes, { writeEdge } from './edge-nodes';
import { eachEdge } from './util';

export const edges = MemoryEdges();
export const names = {};

// Load edges from './edge-nodes.js'
edgeNodes.forEach(edgeNode => {
  eachEdge(edgeNode, edge => edges(writeEdge, edge));
});

// Load names from `./nodes.js`
_.each(nodes, (hash, name) => {
  names[hash] = name;
});

export const recordHashEdge = (head, tail) => {
  const hash = simpleHashEdge(head, tail);
  edges(writeEdge, [head, tail]);
  return hash;
};

export const e = (head, tail) => hashEdge(head, tail, true);

export const s = string => {
  const result = hash(string);
  names[hash] = string;
  return result;
};
