import { deepHashEdge as E, hashList } from '../common/hash';
import { BIND_COMMAND, EDGE, LIST, READ, SET, TAIL, WRITE } from '../common/nodes';

import { BinaryMap, BinObj, Commands } from '../kitsune/util';

const hashSet = set => hashList([SET, ...set.sort()]);

const SetCommands = Commands(
  [
    E(WRITE, SET),
    ({ writeEdge }) => set => {
      const hash = hashSet(set);
      set.forEach(node => writeEdge([hash, node]));
      return hash;
    },
    BinaryMap(BinObj([
      [BIND_COMMAND, { writeEdge: E(WRITE, EDGE) }],
    ])),
  ], [
    E(READ, SET),
    ({ listTail }) => node => listTail(node),
    BinaryMap(BinObj([
      [BIND_COMMAND, { listTail: E(LIST, TAIL) }],
    ])),
  ],
);

export default SetCommands;
