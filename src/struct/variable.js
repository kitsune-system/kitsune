import { BinaryMap, toBinObj, b64, buf } from '../common';
import { deepHashEdge as E } from '../common/hash';
import {
  BIND_COMMAND, ERASE, EDGE, LIST, TAIL, VARIABLE_GET, VARIABLE_SET, WRITE,
} from '../common/nodes';

import { Commands } from '../kitsune/util';

const VariableCommands = Commands(
  [
    VARIABLE_SET,
    ({ writeEdge, destroyEdge, listTail }) => ([varNode, valNode]) => {
      // Remove all tails
      const tails = listTail(varNode);
      tails.forEach(tail => {
        destroyEdge(E(varNode, tail));
      });

      const edge = writeEdge([varNode, valNode]);
      return buf(edge);
    },
    BinaryMap(toBinObj(
      [BIND_COMMAND, {
        writeEdge: E(WRITE, EDGE), destroyEdge: E(ERASE, EDGE),
        listTail: E(LIST, TAIL),
      }],
    )),
  ], [
    VARIABLE_GET,
    ({ listTail }) => varNode => {
      const tails = listTail(varNode);

      if(tails.length > 1)
        throw new Error(`Variable had more than one tail: ${b64(varNode)} -> ${tails.map(b64)}`);

      return tails.length ? tails[0] : null;
    },
    BinaryMap(toBinObj(
      [BIND_COMMAND, { listTail: E(LIST, TAIL) }],
    )),
  ],
);

export default VariableCommands;
