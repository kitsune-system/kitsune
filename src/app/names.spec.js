import _ from 'lodash';

import build from './builder';
import { e } from './hash-local';
import { random } from './hash';
import { NAME, NODE, READ, WRITE } from './nodes';

const [ALPHA, BETA] = _.times(2, random);

describe('Names', () => {
  it('should write and read node names', () => {
    const system = build()('name');

    system(e(WRITE, NAME), { node: ALPHA, name: 'adam' });
    system(e(WRITE, NAME), { node: ALPHA, name: 'alex' });
    system(e(WRITE, NAME), { node: BETA, name: 'adam' });

    system(e(READ, [NODE, NAME]), ALPHA).should.have.members(['adam', 'alex']);
    system(e(READ, [NODE, NAME]), BETA).should.have.members(['adam']);

    system(e(READ, [NAME, NODE]), 'adam').should.have.members([ALPHA, BETA]);
    system(e(READ, [NAME, NODE]), 'alex').should.have.members([ALPHA]);
  });
});
