import { RANDOM } from '@kitsune-system/common';

import { build } from '../kitsune';

describe('Misc Commands', () => {
  it('should work', () => {
    const system = build('system');

    const random = system(RANDOM)();

    random.should.be.a('string');
    Buffer.from(random, 'base64').length.should.equal(32);
  });
});
