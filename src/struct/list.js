import {
  bufferToBase64 as b64, deepHashEdge as E, hashList,
} from '../common/hash';
import { EDGE, LIST_N, READ, VARIABLE_GET, WRITE } from '../common/nodes';

const Commands = system => ({
  [b64(E(WRITE, LIST_N))]: list => {
    const hash = hashList([LIST_N, ...list]);

    let container = hash;
    list.forEach(item => {
      container = system(E(WRITE, EDGE))([container, item]);
    });

    return hash;
  },

  [b64(E(READ, LIST_N))]: listNode => {
    const result = [];

    let next = listNode;
    while(next) {
      const value = system(VARIABLE_GET)(next);
      if(value) {
        result.push(value);
        next = E(next, value);
      } else
        next = null;
    }

    return result;
  },
});

export default Commands;
