import {
  base64ToBuffer as buf, bufferToBase64 as b64, deepHashEdge as E,
} from '../common/hash';
import {
  DESTROY, EDGE, LIST, TAIL, VARIABLE_GET, VARIABLE_SET, WRITE,
} from '../common/nodes';

const commands = system => ({
  [b64(VARIABLE_SET)]: ([varNode, valNode]) => {
    // Remove all tails
    const tails = system(E(LIST, TAIL), varNode);
    tails.forEach(tail => {
      system(E(DESTROY, EDGE), E(varNode, tail));
    });

    const edge = system(E(WRITE, EDGE), [varNode, valNode]);
    return buf(edge);
  },

  [b64(VARIABLE_GET)]: varNode => {
    const tails = system(E(LIST, TAIL), varNode);

    if(tails.length > 1)
      throw new Error(`Variable had more than one tail: ${b64(varNode)} -> ${tails.map(b64)}`);

    return tails.length ? tails[0] : null;
  },
});

export default commands;
