import { Builder } from '@kitsune-system/kitsune-common';

import { bufferToBase64 as b64, deepHashEdge as E } from '../common/hash';
import { READ, HEAD, WRITE, TAIL, RANDOM, CODE, MAP_N } from '../common/nodes';
import { config } from '../kitsune/builder';

describe('MAP_N', () => {
  it('should be able to write and read MAP_Ns', () => {
    const system = Builder(config)('system');

    const map = {
      [b64(READ)]: HEAD,
      [b64(WRITE)]: TAIL,
      [b64(RANDOM)]: CODE,
    };

    // WRITE MAP_N
    const node = system(E(WRITE, MAP_N))(map);
    b64(node).should.equal('6oypFkJKeMLFHqhF+X9XAq0k0QMq7/LVvnqYQcmU5tM=');

    // READ MAP_N
    const newMap = system(E(READ, MAP_N))(node);
    newMap.should.deep.equal(map);
  });
});
