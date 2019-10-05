import {
  deepHashEdge as E, GET_VARIABLE, SET_VARIABLE,
} from '@kitsune-system/common';

import { build } from '../kitsune';

describe('GET_VARIABLE and SET_VARIABLE', () => {
  it('should be able to SET_VARIABLE and GET_VARIABLE', () => {
    const system = build('system');

    const varNode = 'qCy/bc2tlLeQ4mL1e3DcRVnOtEKlNrJd9SRqruISYd4=';
    const valueA = '4oaYHzpku4ukG5WZVHYvvelyhgLi+VyzGhx7gUjHIqQ=';
    const valueB = '+sTdhiE2Ug1e/wddm7RyVMO82CdDRThznasEcXMzY5w=';

    let edge = system(SET_VARIABLE)([varNode, valueA]);
    edge.should.equal(E(varNode, valueA));

    let value = system(GET_VARIABLE)(varNode);
    value.should.equal(valueA);

    edge = system(SET_VARIABLE)([varNode, valueB]);
    edge.should.equal(E(varNode, valueB));

    value = system(GET_VARIABLE)(varNode);
    value.should.equal(valueB);
  });
});
