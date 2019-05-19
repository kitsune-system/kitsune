import { bufferToBase64 as b64, deepHashEdge as E } from '../common/hash';
import { WRITE, SET, LIST, READ } from '../common/nodes';
import { Builder, config } from '../kitsune/builder';

describe('SET', () => {
  it('should be able to write and read SETs', () => {
    const system = Builder(config)('system');

    // WRITE SET
    let node = system(E(WRITE, SET))([LIST, READ, WRITE]);
    b64(node).should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // ORDER DOESN'T MATTER
    node = system(E(WRITE, SET))([WRITE, LIST, READ]);
    b64(node).should.equal('A1AV/fWQVhsG0APSgDRnQYnnqr2wdjcJfKGfBhYLD/g=');

    // READ SET
    const set = system(E(READ, SET))(node);
    set.map(b64).sort().should.deep.equal([LIST, READ, WRITE].map(b64).sort());
  });
});
