import * as common from '@kitsune-system/common';

export const NODES = {};

Object.entries(common).forEach(([key, value]) => {
  if(!/^[A-Z_]+$/.test(key))
    return;

  NODES[key] = value;
});
