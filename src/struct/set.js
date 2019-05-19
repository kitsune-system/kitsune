import { bufferToBase64 as b64, deepHashEdge as E, hashList } from '../common/hash';
import { EDGE, LIST, READ, SET, TAIL, WRITE } from '../common/nodes';

const hashSet = set => hashList([SET, ...set.sort()]);

const Commands = system => ({
  [b64(E(WRITE, SET))]: set => {
    const hash = hashSet(set);
    set.forEach(node => system(E(WRITE, EDGE))([hash, node]));
    return hash;
  },

  [b64(E(READ, SET))]: node => system(E(LIST, TAIL))(node),
});

export default Commands;
