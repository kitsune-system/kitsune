import { Builder } from '@gamedevfox/katana';
import {
  deepHashEdge as E,
  READ, HEAD, WRITE, TAIL, RANDOM, CODE, MAP_N,
} from '@kitsune-system/common';

import { config } from '../kitsune/builder';

describe('MAP_N', () => {
  it('should be able to write and read MAP_Ns', () => {
    const system = Builder(config)('system');

    const map = {
      [READ]: HEAD,
      [WRITE]: TAIL,
      [RANDOM]: CODE,
    };

    // WRITE MAP_N
    const node = system(E(WRITE, MAP_N))(map);
    node.should.equal('6oypFkJKeMLFHqhF+X9XAq0k0QMq7/LVvnqYQcmU5tM=');

    // READ MAP_N
    const newMap = system(E(READ, MAP_N))(node);
    newMap.should.deep.equal(map);
  });
});
