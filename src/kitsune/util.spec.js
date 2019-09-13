import { Map } from '@gamedevfox/katana';

import { meta } from '../kitsune/util';

describe('meta', () => {
  it('should work', () => {
    let obj = Map({ hello: 'world' });
    obj = meta(obj, Map({ first: 1 }));
    obj = meta(obj, Map({ another: 'value' }));
    obj.meta().should.deep.equal({ first: 1, another: 'value' });

    obj = meta(obj, Map({ first: 2 }));
    obj.meta().should.deep.equal({ first: 2, another: 'value' });
  });
});
