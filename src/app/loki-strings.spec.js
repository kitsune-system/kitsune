import LokiStrings from './loki-strings';
import { READ, STRING, SYSTEM, WRITE } from './nodes';
import { e } from './hash-local';

describe('LokiStrings', () => {
  let system;

  beforeEach(() => {
    system = LokiStrings(e(STRING, SYSTEM));
  });

  it('should write and read strings', () => {
    const nodeA = system(e(WRITE, STRING), 'Hello World');

    system(e(READ, STRING), nodeA).should.equal('Hello World');
  });

  it('should be able to write same string, returning the same result', () => {
    system(e(WRITE, STRING), 'Test Me');
    const node = system(e(WRITE, STRING), 'Test Me');

    system(e(READ, STRING), node).should.equal('Test Me');
  });
});
