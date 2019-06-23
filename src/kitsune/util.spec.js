import { BinaryMap } from '../common';
import { meta } from '../kitsune/util';

describe('meta', () => {
  it('should work', () => {
    let obj = BinaryMap({ hello: 'world' });
    obj = meta(obj, BinaryMap({ first: 1 }));
    obj = meta(obj, BinaryMap({ another: 'value' }));
    obj.meta().should.deep.equal({ first: 1, another: 'value' });

    obj = meta(obj, BinaryMap({ first: 2 }));
    obj.meta().should.deep.equal({ first: 2, another: 'value' });
  });
});
