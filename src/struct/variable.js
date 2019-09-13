import { Map } from '@gamedevfox/katana';
import {
  deepHashEdge as E,
  BIND_COMMAND, ERASE, EDGE, LIST, TAIL, VARIABLE_GET, VARIABLE_SET, WRITE,
} from '@kitsune-system/common';

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
      return edge;
    },
    Map({
      [BIND_COMMAND]: {
        writeEdge: E(WRITE, EDGE), destroyEdge: E(ERASE, EDGE),
        listTail: E(LIST, TAIL),
      },
    }),
  ], [
    VARIABLE_GET,
    ({ listTail }) => varNode => {
      const tails = listTail(varNode);

      if(tails.length > 1)
        throw new Error(`Variable had more than one tail: ${varNode} -> ${tails}`);

      return tails.length ? tails[0] : null;
    },
    Map({
      [BIND_COMMAND]: { listTail: E(LIST, TAIL) },
    }),
  ],
);

export default VariableCommands;
