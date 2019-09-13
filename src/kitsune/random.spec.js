import { randomBase } from './random';

describe('random', () => {
  it('should work', () => {
    Buffer.from(randomBase(4), 'base64').length.should.equal(1);
    Buffer.from(randomBase(8), 'base64').length.should.equal(1);
    Buffer.from(randomBase(9), 'base64').length.should.equal(2);
    Buffer.from(randomBase(16), 'base64').length.should.equal(2);
    Buffer.from(randomBase(17), 'base64').length.should.equal(3);
    Buffer.from(randomBase(100), 'base64').length.should.equal(13);
  });
});
