import System from './system';
import { hashEdge } from './hash';
import { readEdge, writeEdge } from './edge-nodes';

const MemoryEdges = () => {
  const edges = {};

  const system = System();

  system.command(writeEdge, edge => {
    const node = hashEdge(edge);
    edges[node] = edge;
    return node;
  });

  system.command(readEdge, node => edges[node]);

  return system;
};

export default MemoryEdges;
