import fs from 'fs';
import rimraf from 'rimraf';

import Files from './files';
import { e } from './hash';
import { FILE, PATH, READ, WRITE } from './nodes';

const path = '/tmp/kitsune/files';
const data = 'Hello File!\n';

describe('Files', () => {
  before(done => rimraf(path, done));

  it('should write and read files', () => {
    const system = Files({ path });

    const node = system(e(WRITE, FILE), data);
    const filePath = system(e(READ, PATH), node);
    fs.readFileSync(filePath, 'utf8').should.equal(data);

    system(e(READ, FILE), node).should.equal(data);
  });
});
