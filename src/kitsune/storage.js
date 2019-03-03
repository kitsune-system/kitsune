import fs from 'fs';

import { hashEdge as E } from '../kitsune/hash';
import { EDGE, LIST } from '../kitsune/nodes';

const Storage = (path, system) => ({
  save: () => {
    return new Promise((resolve, reject) => {
      const edges = system(E(LIST, EDGE));
      const json = JSON.stringify(edges);
      fs.writeFile(path, json, err => {
        if(err)
          reject(err);
        else
          resolve();
      });
    });
  },
  load: () => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, json) => {
        if(err)
          reject();

        const data = JSON.parse(json);
        data.forEach(edge => {
          console.log('LOAD EDGE', edge);
        });

        resolve(data);
      });
    });
  },
});

export default Storage;
