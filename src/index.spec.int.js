import { HttpSystem, RANDOM } from '@kitsune-system/common';

const system = HttpSystem('http://localhost:8080');

describe('integration specs', () => {
  it('RANDOM should return 32 bytes string', done => {
    system(RANDOM)(null, value => {
      value.length.should.equal(44);
      done();
    });
  });
});
