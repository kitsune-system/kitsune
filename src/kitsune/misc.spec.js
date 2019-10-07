import { RANDOM } from '@kitsune-system/common';

import { coreConfig } from './misc';

describe.only('Misc Commands', () => {
  it('should work', done => {
    coreConfig[RANDOM].fn()(null, random => {
      random.should.be.a('string');
      Buffer.from(random, 'base64').length.should.equal(32);

      done();
    });
  });
});
