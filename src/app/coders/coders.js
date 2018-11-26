import _ from 'lodash';

import { e } from '../hash';
import System from '../system';
import { C, CODE, ECMA_SCRIPT, HELLO_WORLD, JAVA, NAME, NODE, READ, RUBY } from '../nodes';
import { block as b } from '../util';

const code = {
  [C]: {
    [HELLO_WORLD]: b`
      #include <stdio.h>

      int main() {
        printf("Hello World\\n");
        return 0;
      }
    `
  },
  [ECMA_SCRIPT]: {
    [HELLO_WORLD]: b`
      console.log('Hello World');
    `
  },
  [JAVA]: {
    [HELLO_WORLD]: b`
      public class \${ className } {
        public static void main(String[] args) {
            System.out.println("Hello World");
        }
      }
    `
  },
  [RUBY]: {
    [HELLO_WORLD]: b`
      puts 'Hello World'
    `
  }
};

const Coder = baseSystem => {
  const system = System({ baseSystem });

  [C, ECMA_SCRIPT, RUBY].forEach(lang => {
    system.command(e(CODE, lang), system => code[lang][system]);
  });

  system.command(e(CODE, JAVA),
    [e(READ, [NODE, NAME])],
    readNames => system => {
      const javaTemplate = code[JAVA][system];

      const names = readNames(system);
      const className = names[0] || 'App';

      const template = _.template(javaTemplate);
      return template({ className });
    }
  );

  return system;
};

export default Coder;
