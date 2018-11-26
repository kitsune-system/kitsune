import { execSync } from 'child_process';

import build from '../builder';
import { e } from '../hash';
import { BUILD, C, ECMA_SCRIPT, HELLO_WORLD, JAVA, NAME, RUBY, SYSTEM, WRITE } from '../nodes';

const TEST_FILE_SYSTEM_PATH = '/tmp/kitsune/files';

describe.skip('system-builders', () => {
  before(() => {
    execSync(`rm -rf ${TEST_FILE_SYSTEM_PATH}`);
  });

  Object.entries({ C, ECMA_SCRIPT, JAVA, RUBY }).forEach(([lang, langId]) => {
    describe(`${lang} builder`, () => {
      it('hello world', () => {
        const system = build({ fileSystemPath: TEST_FILE_SYSTEM_PATH })('build');

        system(e(WRITE, NAME), { node: HELLO_WORLD, name: 'YourMom' });

        const systemId = system(e(BUILD, [langId, SYSTEM]), HELLO_WORLD);
        system(systemId).should.equal('Hello World\n');
      });
    });
  });
});
