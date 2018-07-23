import _ from 'lodash';

import MemoryEdges from './memory-edges';
import { EDGE, READ, WRITE } from './nodes';
import { random } from './hash';
import { e } from './hash-local';

const [ALPHA, BETA] = _.times(2, random);

describe('MemoryEdges', () => {
  it('should write and read edges', () => {
    const system = MemoryEdges();

    const node = system(e(WRITE, EDGE), [ALPHA, BETA]);
    system(e(READ, EDGE), node).should.deep.equal([ALPHA, BETA]);
  });
});
