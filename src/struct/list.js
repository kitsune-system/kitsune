import { deepHashEdge as E, hashList } from '../common/hash';
import { EDGE, LIST_N, READ, BIND_COMMAND, VARIABLE_GET, WRITE } from '../common/nodes';

import { BinaryMap, BinObj, Commands } from '../kitsune/util';

const ListCommands = Commands(
  [
    E(WRITE, LIST_N),
    ({ writeEdge }) => list => {
      const hash = hashList([LIST_N, ...list]);

      let container = hash;
      list.forEach(item => {
        container = writeEdge([container, item]);
      });

      return hash;
    },
    BinaryMap(BinObj([
      [BIND_COMMAND, { writeEdge: E(WRITE, EDGE) }],
    ])),
  ], [
    E(READ, LIST_N),
    ({ variableGet }) => listNode => {
      const result = [];

      let next = listNode;
      while(next) {
        const value = variableGet(next);
        if(value) {
          result.push(value);
          next = E(next, value);
        } else
          next = null;
      }

      return result;
    },
    BinaryMap(BinObj([
      [BIND_COMMAND, { variableGet: VARIABLE_GET }],
    ])),
  ],
);

export default ListCommands;
