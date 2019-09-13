import { Builder } from '@gamedevfox/katana';
import { RANDOM } from '@kitsune-system/common';

import { config } from '../kitsune/builder';

describe('Misc Commands', () => {
  it('should work', () => {
    const builder = Builder(config);
    const system = builder('system');

    const random = system(RANDOM)();

    random.should.be.a('string');
    Buffer.from(random, 'base64').length.should.equal(32);
  });
});
