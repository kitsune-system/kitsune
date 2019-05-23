import {
  base64ToBuffer as buf, bufferToBase64 as b64, deepHashEdge as E,
} from '../common/hash';
import {
  BIND_COMMAND, DESTROY, EDGE, LIST, TAIL, VARIABLE_GET, VARIABLE_SET, WRITE,
} from '../common/nodes';

import { BinaryMap, BinObj, Commands } from '../kitsune/util';

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
    BinaryMap(BinObj([
      [BIND_COMMAND, {
        writeEdge: E(WRITE, EDGE), destroyEdge: E(DESTROY, EDGE),
        listTail: E(LIST, TAIL),
      }],
    ])),
  ], [
    VARIABLE_GET,
    ({ listTail }) => varNode => {
      const tails = listTail(varNode);

      if(tails.length > 1)
        throw new Error(`Variable had more than one tail: ${b64(varNode)} -> ${tails.map(b64)}`);

      return tails.length ? tails[0] : null;
    },
    BinaryMap(BinObj([
      [BIND_COMMAND, { listTail: E(LIST, TAIL) }],
    ])),
  ],
);

export default VariableCommands;
