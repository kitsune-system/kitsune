import { Map } from '@gamedevfox/katana';
import {
  deepHashEdge as E, hashList,
  BIND_COMMAND, EDGE, LIST_V, READ, MAP_N, TAIL, WRITE,
} from '@kitsune-system/common';

import { Commands } from '../kitsune/util';

const hashMap = map => {
  const kvList = Object.entries(map).map(([key, value]) => [key, value]).sort();
  return hashList([MAP_N, ...kvList]);
};

export const MapCommands = Commands(
  [
    E(WRITE, MAP_N),
    ({ writeEdge }) => map => {
      const hash = hashMap(map);

      const kvList = Object.entries(map).map(([key, value]) => [key, value]);
      kvList.forEach(([key, value]) => {
        const edge = writeEdge([hash, key]);
        writeEdge([edge, value]);
      });

      return hash;
    },
    Map({
      [BIND_COMMAND]: { writeEdge: E(WRITE, EDGE) },
    }),
  ], [
    E(READ, MAP_N),
    ({ listTail }) => node => {
      const result = {};

      const keys = listTail(node);
      keys.forEach(key => {
        const tails = listTail(E(node, key));
        if(tails.length !== 1)
          throw new Error(`\`tails\` length was supposed to be 1; was: ${tails.length}`);

        result[key] = tails[0];
      });

      return result;
    },
    Map({
      [BIND_COMMAND]: { listTail: E(LIST_V, TAIL) },
    }),
  ]
);
