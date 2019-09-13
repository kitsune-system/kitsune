import {
  deepHashEdge as E, EDGE, LIST, STRING, WRITE,
} from '@kitsune-system/common';

import { easyWrite, readJson } from './files';

const Storage = (path, system) => {
  const edgePath = `${path}/edges`;
  const stringPath = `${path}/strings`;

  return {
    save: () => {
      const edges = system(E(LIST, EDGE));
      const strings = system(E(LIST, STRING));

      const simpleEdges = edges.map(edge => [edge[0], edge[1]]);
      const simpleStrings = strings.map(row => row.string);

      return Promise.all([
        easyWrite(edgePath, simpleEdges),
        easyWrite(stringPath, simpleStrings),
      ]);
    },
    load: () => {
      const edgeP = readJson(edgePath).then(data => {
        data.forEach(edge => {
          system(E(WRITE, EDGE), [edge[0], edge[1]]);
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
