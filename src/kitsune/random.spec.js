import { randomBase } from './random';

describe('random', () => {
  it('should work', () => {
    randomBase(4).length.should.equal(1);
    randomBase(8).length.should.equal(1);
    randomBase(9).length.should.equal(2);
    randomBase(16).length.should.equal(2);
    randomBase(17).length.should.equal(3);
    randomBase(100).length.should.equal(13);
  });
});
