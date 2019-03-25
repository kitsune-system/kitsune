import { bufferToBase64 as b64, deepHashEdge as E } from '../kitsune/hash';
import { CODE, EDGE, READ, STRING } from '../kitsune/nodes';

const CodeCommands = system => ({
  [b64(CODE)]: edgeNode => {
    const edge = system(E(READ, EDGE), edgeNode);
    if(!edge)
      throw new Error(`Edge ${b64(edgeNode)} could not be found.`);

    const [type, node] = edge;
    const value = system(E(READ, type), node);
    return system(E(CODE, type), value);
  },

  [b64(E(CODE, STRING))]: string => JSON.stringify(string),
});

export default CodeCommands;
