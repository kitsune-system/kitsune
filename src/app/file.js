import fs from 'fs';

import System from './system';
import { e } from './hash-local';
import { FILE, PATH, READ, WRITE } from './nodes';
import { base64ToHex, hash } from './hash';

const Files = ({ path, baseSystem }) => {
  if(!fs.existsSync(path))
    fs.mkdirSync(path);

  const system = System({ baseSystem });

  system.command(e(READ, PATH), node => `${path}/${base64ToHex(node)}`);

  system.command(e(WRITE, FILE),
    [e(READ, PATH)],
    readPath => string => {
      const node = hash(string);

      const filePath = readPath(node);
      fs.writeFileSync(filePath, string);

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
