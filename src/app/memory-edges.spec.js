import _ from 'lodash';

import { e, random } from './hash';
import { MemoryEdges } from './hash';
import { EDGE, READ, WRITE } from './nodes';

const [ALPHA, BETA] = _.times(2, random);

describe('MemoryEdges', () => {
  it('should write and read edges', () => {
    const system = MemoryEdges();

    const node = system(e(WRITE, EDGE), [ALPHA, BETA]);
    system(e(READ, EDGE), node).should.deep.equal([ALPHA, BETA]);
  });
});
