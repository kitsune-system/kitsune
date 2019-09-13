import { Builder } from '@gamedevfox/katana';
import {
  deepHashEdge as E, VARIABLE_GET, VARIABLE_SET,
} from '@kitsune-system/common';

import { config } from '../kitsune/builder';

describe('VARIABLE_GET and VARIABLE_SET', () => {
  it('should be able to SET and GET VARIABLES', () => {
    const system = Builder(config)('system');

    const varNode = 'qCy/bc2tlLeQ4mL1e3DcRVnOtEKlNrJd9SRqruISYd4=';
    const valueA = '4oaYHzpku4ukG5WZVHYvvelyhgLi+VyzGhx7gUjHIqQ=';
    const valueB = '+sTdhiE2Ug1e/wddm7RyVMO82CdDRThznasEcXMzY5w=';

    let edge = system(VARIABLE_SET)([varNode, valueA]);
    edge.should.equal(E(varNode, valueA));

    let value = system(VARIABLE_GET)(varNode);
    value.should.equal(valueA);

    edge = system(VARIABLE_SET)([varNode, valueB]);
    edge.should.equal(E(varNode, valueB));

    value = system(VARIABLE_GET)(varNode);
    value.should.equal(valueB);
  });
});
