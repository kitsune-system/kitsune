import fs from 'fs';
import mkdirp from 'mkdirp';

import {
  base64ToBuffer as buf, bufferToBase64 as b64, hashEdge as E,
} from '../common/hash';
import { EDGE, LIST, STRING, WRITE } from '../common/nodes';

const save = (path, data) => {
  const json = JSON.stringify(data);

  return new Promise((resolve, reject) => {
    fs.writeFile(path, json, err => {
      if(err)
        reject(err);
      else
        resolve();
    });
  });
};

const load = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, json) => {
      if(err) {
        reject(err);
        return;
      }

      const data = JSON.parse(json);
      resolve(data);
    });
  });
};

const Storage = (path, system) => {
  const edgePath = `${path}/edges`;
  const stringPath = `${path}/strings`;

  return {
    save: () => {
      const edges = system(E(LIST, EDGE));
      const strings = system(E(LIST, STRING));

      const simpleEdges = edges.map(edge => [b64(edge[0]), b64(edge[1])]);
      const simpleStrings = strings.map(row => row.string);

      mkdirp(path);
      return Promise.all([
        save(edgePath, simpleEdges),
        save(stringPath, simpleStrings),
      ]);
    },
    load: () => {
      const edgeP = load(edgePath).then(data => {
        data.forEach(edge => {
          system(E(WRITE, EDGE), [buf(edge[0]), buf(edge[1])]);
        });
        console.log('LOADED EDGES', data);
      });

      const stringP = load(stringPath).then(data => {
        data.forEach(string => {
          system(E(WRITE, STRING), string);
        });
        console.log('LOADED STRINGS', data);
      });

      return Promise.all([edgeP, stringP]);
    },
  };
};

export default Storage;
