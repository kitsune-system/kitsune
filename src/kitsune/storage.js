import fs from 'fs';
import mkdirp from 'mkdirp';

import {
  base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E,
} from '../kitsune/hash';
import { EDGE, LIST, WRITE } from '../kitsune/nodes';

const Storage = (path, system) => {
  const edgePath = `${path}/edges`;

  return {
    save: () => {
      return new Promise((resolve, reject) => {
        const edges = system(E(LIST, EDGE));

        const simpleEdges = edges.map(edge => [b64(edge[0]), b64(edge[1])]);
        const json = JSON.stringify(simpleEdges);

        mkdirp(path);
        fs.writeFile(edgePath, json, err => {
          if(err)
            reject(err);
          else
            resolve();
        });
      });
    },
    load: () => {
      return new Promise((resolve, reject) => {
        fs.readFile(edgePath, (err, json) => {
          if(err)
            reject();

          const data = JSON.parse(json);
          data.forEach(edge => {
            console.log('LOAD EDGE', edge);
            system(E(WRITE, EDGE), [buf(edge[0]), buf(edge[1])]);
          });

          resolve(data);
        });
      });
    },
  };
};

export default Storage;
