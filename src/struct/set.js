import { Map } from '@gamedevfox/katana';
import {
  deepHashEdge as E, hashList,
  BIND_COMMAND, EDGE, LIST_V, READ, SET_N, TAIL, WRITE,
} from '@kitsune-system/common';

import { Commands } from '../kitsune/util';

const hashSet = set => hashList([SET_N, ...set.sort()]);

export const SetCommands = Commands(
  [
    E(WRITE, SET_N),
    ({ writeEdge }) => set => {
      const hash = hashSet(set);
      set.forEach(node => writeEdge([hash, node]));
      return hash;
    },
    Map({
      [BIND_COMMAND]: { writeEdge: E(WRITE, EDGE) },
    }),
  ], [
    E(READ, SET_N),
    ({ listTail }) => node => listTail(node),
    Map({
      [BIND_COMMAND]: { listTail: E(LIST_V, TAIL) },
    }),
  ],
);
