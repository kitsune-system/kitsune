import { e } from '../hash-local';
import { BUILD, C, ECMA_SCRIPT, HELLO_WORLD, JAVA, NAME, RUBY, SYSTEM, WRITE } from '../nodes';
import build from '../builder';

describe('system-builders', () => {
  it('should work', () => {
    const system = build({ fileSystemPath: '/tmp/kitsune/files' })('build');

    system(e(WRITE, NAME), { node: HELLO_WORLD, name: 'HelloWorld' });

    [C, ECMA_SCRIPT, JAVA, RUBY].forEach(lang => {
      const systemId = system(e(BUILD, [lang, SYSTEM]), HELLO_WORLD);
      system(systemId).should.equal('Hello World\n');
    });
  });
});
