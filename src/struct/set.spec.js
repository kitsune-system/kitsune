import {
  deepHashEdge as E, WRITE, SET_N, LIST_V, READ,
} from '@kitsune-system/common';

import { build } from '../kitsune';

describe('SET_N', () => {
  it('should be able to write and read SETs', () => {
    const system = build('system');

    // WRITE SET_N
    let node = system(E(WRITE, SET_N))([LIST_V, READ, WRITE]);
    node.should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // ORDER DOESN'T MATTER
    node = system(E(WRITE, SET_N))([WRITE, LIST_V, READ]);
    node.should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // READ SET_N
    // TODO: Use a real set
    const set = system(E(READ, SET_N))(node);
    set.sort().should.deep.equal([LIST_V, READ, WRITE].sort());
  });
});
