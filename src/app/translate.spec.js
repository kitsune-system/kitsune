import build from './builder';
import { e } from './hash-local';
import { ALL, CONVERT, DEEP, EDGE, IS, NAME, NESTED, NODE, READ, STRING, SUPPORTED, TAIL, WRITE } from './nodes';
import { translate, writeEdge } from './edge-nodes';

describe('Translate', () => {
  let system;
  beforeEach(() => {
    system = build('translate');
  });

  it('should convert node to nested edge', () => {
    const node = e([READ, WRITE], [[ALL, IS], [SUPPORTED, [TAIL, STRING]]]);

    const nestedEdge = system(e(CONVERT, [NODE, [NESTED, EDGE]]), node);
    nestedEdge.should.deep.equal([[READ, WRITE], [[ALL, IS], [SUPPORTED, [TAIL, STRING]]]]);

    const namesA = system(e(DEEP, [CONVERT, [NODE, NAME]]), nestedEdge);
    namesA.should.deep.equal([['READ', 'WRITE'], [['ALL', 'IS'], ['SUPPORTED', ['TAIL', 'STRING']]]]);

    const namesB = system(e(CONVERT, [NODE, [NESTED, NAME]]), node);
    namesB.should.deep.equal([['READ', 'WRITE'], [['ALL', 'IS'], ['SUPPORTED', ['TAIL', 'STRING']]]]);
  });

  // Note: To make doubly sure this test passes, run it by itself
  it('should be able to translate edge-nodes', () => {
    system(translate, writeEdge).should.deep.equal(['WRITE', 'EDGE']);
  });
});
