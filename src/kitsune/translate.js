import { edgeMap } from '@kitsune-system/common';

import { NODES } from '../kitsune/nodes';

export const expand = node => {
  let result = NODES[node];

  if(!result) {
    const edge = edgeMap[node];
    if(edge)
      result = edge.map(expand);
    else
      result = node;
  }

  return result;
};
