import fs from 'fs';
import mkdirp from 'mkdirp';

import { base64ToHex, e, hash } from './hash';
import { FILE, PATH, READ, SYSTEM, WRITE } from './nodes';
import System from './system';

const Files = ({ path, baseSystem }) => {
  if(!fs.existsSync(path))
    mkdirp.sync(path);

  const system = System({ baseSystem });

  system.command(e(READ, [[FILE, SYSTEM], PATH]), () => path);
  system.command(e(READ, PATH), node => `${path}/${base64ToHex(node)}`);

  system.command(e(WRITE, FILE),
    [e(READ, PATH)],
    readPath => string => {
      const node = hash(string);

      const filePath = readPath(node);
      fs.writeFileSync(filePath, string, {
        encoding: 'utf8',
        mode: 0o666,
      });

      return node;
    }
  );

  system.command(e(READ, FILE),
    [e(READ, PATH)],
    readPath => node => {
      const filePath = readPath(node);
      return fs.readFileSync(filePath, 'utf8');
    }
  );

  return system;
};

export default Files;
