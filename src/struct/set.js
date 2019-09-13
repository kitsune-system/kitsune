import { Map } from '@gamedevfox/katana';
import {
  deepHashEdge as E, hashList,
  BIND_COMMAND, EDGE, LIST, READ, SET, TAIL, WRITE,
} from '@kitsune-system/common';

import { Commands } from '../kitsune/util';

const hashSet = set => hashList([SET, ...set.sort()]);

const SetCommands = Commands(
  [
    E(WRITE, SET),
    ({ writeEdge }) => set => {
      const hash = hashSet(set);
      set.forEach(node => writeEdge([hash, node]));
      return hash;
    },
    Map({
      [BIND_COMMAND]: { writeEdge: E(WRITE, EDGE) },
    }),
  ], [
    E(READ, SET),
    ({ listTail }) => node => listTail(node),
    Map({
      [BIND_COMMAND]: { listTail: E(LIST, TAIL) },
    }),
  ],
);

export default SetCommands;
