import { C, CODE, ECMA_SCRIPT, HELLO_WORLD, JAVA, RUBY } from '../nodes';
import { e } from '../hash-local';
import build from '../builder';

describe('Coder', () => {
  it.skip('"hello world" should work', () => {
    const system = build()('code');

    [C, ECMA_SCRIPT, JAVA, RUBY].forEach(lang => {
      // TODO: Change to [CODE, SYSTEM]
      const code = system(e(CODE, lang), HELLO_WORLD);

      console.log('==', lang, '==');
      console.log(code);
    });
  });
});
