import fs from 'fs';

import { e } from './hash-local';
import { FILE, PATH, READ, WRITE } from './nodes';
import Files from './file';

const path = '/tmp/kitsune/files';
const data = 'Hello File!\n';

describe('Files', () => {
  it('should write and read files', () => {
    const system = Files({ path });

    const node = system(e(WRITE, FILE), data);
    const filePath = system(e(READ, PATH), node);
    fs.readFileSync(filePath, 'utf8').should.equal(data);

    system(e(READ, FILE), node).should.equal(data);
  });
});
