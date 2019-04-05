import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

const fsCallback = (resolve, reject) => (err, data) => {
  if(err)
    reject(err);
  else if(data)
    resolve(data);
  else
    resolve();
};

export const write = (path, data) => new Promise((resolve, reject) => {
  fs.writeFile(path, data, 'utf8', fsCallback(resolve, reject));
});

export const read = path => new Promise((resolve, reject) => {
  fs.readFile(path, 'utf8', fsCallback(resolve, reject));
});

export const readJson = path => read(path).then(json => JSON.parse(json));

export const easyWrite = (pathName, data) => {
  const dir = path.dirname(pathName);
  mkdirp.sync(dir);

  if(typeof data !== 'string')
    data = JSON.stringify(data);

  return write(pathName, data);
};
