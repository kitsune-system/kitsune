import { easyWrite, readJson } from './files';

import {
  base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E,
} from '../common/hash';
import { EDGE, LIST, STRING, WRITE } from '../common/nodes';

const Storage = (path, system) => {
  const edgePath = `${path}/edges`;
  const stringPath = `${path}/strings`;

  return {
    save: () => {
      const edges = system(E(LIST, EDGE));
      const strings = system(E(LIST, STRING));

      const simpleEdges = edges.map(edge => [b64(edge[0]), b64(edge[1])]);
      const simpleStrings = strings.map(row => row.string);

      return Promise.all([
        easyWrite(edgePath, simpleEdges),
        easyWrite(stringPath, simpleStrings),
      ]);
    },
    load: () => {
      const edgeP = readJson(edgePath).then(data => {
        data.forEach(edge => {
          system(E(WRITE, EDGE), [buf(edge[0]), buf(edge[1])]);
        });
      });

      const stringP = readJson(stringPath).then(data => {
        data.forEach(string => {
          system(E(WRITE, STRING), string);
        });
      });

      return Promise.all([edgeP, stringP]);
    },
  };
};

export default Storage;
