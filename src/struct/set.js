import { BinaryMap, E, toBinObj } from '../common';
import { hashList } from '../common/hash';
import { BIND_COMMAND, EDGE, LIST, READ, SET, TAIL, WRITE } from '../common/nodes';

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
    BinaryMap(toBinObj(
      [BIND_COMMAND, { writeEdge: E(WRITE, EDGE) }],
    )),
  ], [
    E(READ, SET),
    ({ listTail }) => node => listTail(node),
    BinaryMap(toBinObj(
      [BIND_COMMAND, { listTail: E(LIST, TAIL) }],
    )),
  ],
);

export default SetCommands;
