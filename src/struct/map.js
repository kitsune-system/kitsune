import {
  base64ToBuffer as buf, bufferToBase64 as b64, deepHashEdge as E, hashList,
} from '../kitsune/hash';
import { EDGE, LIST, READ, MAP_N, TAIL, WRITE } from '../kitsune/nodes';

const hashMap = map => {
  const kvList = Object.entries(map).map(([key, value]) => [buf(key), value]).sort();
  return hashList([MAP_N, ...kvList]);
};

const commands = system => ({
  [b64(E(WRITE, MAP_N))]: map => {
    const hash = hashMap(map);

    const kvList = Object.entries(map).map(([key, value]) => [buf(key), value]);
    kvList.forEach(([key, value]) => {
      const edge = system(E(WRITE, EDGE), [hash, key]);
      system(E(WRITE, EDGE), [edge, value]);
    });

    return hash;
  },

  [b64(E(READ, MAP_N))]: node => {
    const result = {};

    const keys = system(E(LIST, TAIL), node);
    keys.forEach(key => {
      const tails = system(E(LIST, TAIL), E(node, key));
      if(tails.length !== 1)
        throw new Error(`\`tails\` was supposed to be 1; was: ${tails}`);

      result[b64(key)] = buf(tails[0]);
    });

    return result;
  },
});

export default commands;
