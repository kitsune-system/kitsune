import {
  deepHashEdge as E,
  CODE, EDGE, READ, STRING,
} from '@kitsune-system/common';

const Commands = system => ({
  [CODE]: edgeNode => {
    const edge = system(E(READ, EDGE), edgeNode);
    if(!edge)
      throw new Error(`Edge ${edgeNode} could not be found.`);

    const [type, node] = edge;
    const value = system(E(READ, type), node);
    return system(E(CODE, type), value);
  },

  [E(CODE, STRING)]: string => JSON.stringify(string),
});

export default Commands;
