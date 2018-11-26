import _ from 'lodash';

import { e, random } from './hash';
import LokiEdges from './loki-edges';
import LokiStrings from './loki-strings';
import MultiSystem from './multi-system';
import { ALL, COMMAND, EDGE, IS, READ, STRING, SUPPORTED, WRITE } from './nodes';

const [ALPHA, BETA] = _.times(2, random);

describe('MultiSystem', () => {
  let system;

  beforeEach(() => {
    system = MultiSystem();

    system.push(LokiEdges());
    system.push(LokiStrings());
  });

  it('should return information about supported commands', () => {
    system(e(READ, [IS, [SUPPORTED, COMMAND]]), [e(WRITE, EDGE)]).should.be.true;
    system(e(READ, [IS, [SUPPORTED, COMMAND]]), [e(READ, STRING)]).should.be.true;
    system(e(READ, [IS, [SUPPORTED, COMMAND]]), [ALPHA]).should.be.false;

    system(e(READ, [ALL, [SUPPORTED, COMMAND]])).should.deep.contains(
      e(READ, [IS, [SUPPORTED, COMMAND]]),
      e(READ, [ALL, [SUPPORTED, COMMAND]]),
      e(WRITE, EDGE),
      e(READ, EDGE),
      e(WRITE, STRING),
      e(READ, STRING)
    );
  });

  it('should delegate all command requests to child systems', () => {
    // Test invocations
    const edge = system(e(WRITE, EDGE), [ALPHA, BETA]);
    system(e(READ, EDGE), edge).should.deep.equal([ALPHA, BETA]);

    const string = system(e(WRITE, STRING), 'Multi Test');
    system(e(READ, STRING), string).should.deep.equal('Multi Test');
  });
});
