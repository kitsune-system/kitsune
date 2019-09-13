import { Builder } from '@gamedevfox/katana';
import {
  deepHashEdge as E, WRITE, SET, LIST, READ,
} from '@kitsune-system/common';

import { config } from '../kitsune/builder';

describe('SET', () => {
  it('should be able to write and read SETs', () => {
    const system = Builder(config)('system');

    // WRITE SET
    let node = system(E(WRITE, SET))([LIST, READ, WRITE]);
    node.should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // ORDER DOESN'T MATTER
    node = system(E(WRITE, SET))([WRITE, LIST, READ]);
    node.should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // READ SET
    // TODO: Use a real set
    const set = system(E(READ, SET))(node);
    set.sort().should.deep.equal([LIST, READ, WRITE].sort());
  });
});
