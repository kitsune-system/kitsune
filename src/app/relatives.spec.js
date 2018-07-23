import _ from 'lodash';

import build from './builder';
import { READ, RELATIVE, WRITE } from './nodes';
import { random } from './hash';
import { e } from './hash-local';

const [ALPHA, BETA, TYPE_A, TYPE_B] = _.times(4, random);

describe('Relatives', () => {
  let system;

  beforeEach(() => {
    system = build('relative');
  });

  it('should be able to read and write bi-directional relatives', () => {
    system(e(WRITE, RELATIVE), { nodes: [ALPHA, BETA], type: TYPE_A });
    (system(e(READ, RELATIVE), { node: ALPHA, type: TYPE_A })).should.deep.equal([BETA]);
    (system(e(READ, RELATIVE), { node: BETA, type: TYPE_A })).should.deep.equal([ALPHA]);
  });

  it('should be able to read and write directional relatives', () => {
    system(e(WRITE, RELATIVE), { nodes: [ALPHA, BETA], type: [TYPE_A, TYPE_B] });

    (system(e(READ, RELATIVE), { node: ALPHA, type: [TYPE_A, TYPE_B] })).should.deep.equal([BETA]);
    (system(e(READ, RELATIVE), { node: ALPHA, type: [TYPE_B, TYPE_A] })).should.deep.equal([]);

    (system(e(READ, RELATIVE), { node: BETA, type: [TYPE_A, TYPE_B] })).should.deep.equal([]);
    (system(e(READ, RELATIVE), { node: BETA, type: [TYPE_B, TYPE_A] })).should.deep.equal([ALPHA]);
  });
});
