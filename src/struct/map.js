import { BinaryMap, E, b64, buf, toBinObj } from '../common';
import { hashList } from '../common/hash';
import { BIND_COMMAND, EDGE, LIST, READ, MAP_N, TAIL, WRITE } from '../common/nodes';

import { Commands } from '../kitsune/util';

const hashMap = map => {
  const kvList = Object.entries(map).map(([key, value]) => [buf(key), value]).sort();
  return hashList([MAP_N, ...kvList]);
};

const MapCommands = Commands(
  [
    E(WRITE, MAP_N),
    ({ writeEdge }) => map => {
      const hash = hashMap(map);

      const kvList = Object.entries(map).map(([key, value]) => [buf(key), value]);
      kvList.forEach(([key, value]) => {
        const edge = writeEdge([hash, key]);
        writeEdge([edge, value]);
      });

      return hash;
    },
    BinaryMap(toBinObj(
      [BIND_COMMAND, { writeEdge: E(WRITE, EDGE) }],
    )),
  ], [
    E(READ, MAP_N),
    ({ listTail }) => node => {
      const result = {};

      const keys = listTail(node);
      keys.forEach(key => {
        const tails = listTail(E(node, key));
        if(tails.length !== 1)
          throw new Error(`\`tails\` length was supposed to be 1; was: ${tails.length}`);

        result[b64(key)] = buf(tails[0]);
      });

      return result;
    },
    BinaryMap(toBinObj(
      [BIND_COMMAND, { listTail: E(LIST, TAIL) }],
    )),
  ]
);

export default MapCommands;
