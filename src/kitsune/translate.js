import { bufferToBase64 as b64, readEdge } from '../common/hash';
import * as nativeNodes from '../common/nodes';

const nodeNameMap = {};
Object.entries(nativeNodes).forEach(([name, node]) => {
  nodeNameMap[b64(node)] = name;
});

export const getNativeName = node => nodeNameMap[b64(node)];

export const expand = node => {
  let result = getNativeName(node);

  if(!result) {
    const edge = readEdge(node);
    if(edge)
      result = edge.map(expand);
    else
      result = node;
  }

  return result;
};
