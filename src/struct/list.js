import { Map } from '@gamedevfox/katana';
import {
  deepHashEdge as E, hashList,
  EDGE, LIST_N, READ, BIND_COMMAND, VARIABLE_GET, WRITE,
} from '@kitsune-system/common';

import { Commands } from '../kitsune/util';

const ListCommands = Commands([
  E(WRITE, LIST_N),
  ({ writeEdge }) => list => {
    const hash = hashList([LIST_N, ...list]);

    let container = hash;
    list.forEach(item => {
      container = writeEdge([container, item]);
    });

    return hash;
  },
  Map({
    [BIND_COMMAND]: { writeEdge: E(WRITE, EDGE) },
  }),
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
  Map({
    [BIND_COMMAND]: { variableGet: VARIABLE_GET },
  }),
]);

export default ListCommands;
