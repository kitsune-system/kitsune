import { Builder } from '@kitsune-system/kitsune-common';

import {
  base64ToBuffer as buf, bufferToBase64 as b64, deepHashEdge as E,
} from '../common/hash';
import { VARIABLE_GET, VARIABLE_SET } from '../common/nodes';
import { config } from '../kitsune/builder';

describe('VARIABLE_GET and VARIABLE_SET', () => {
  it('should be able to SET and GET VARIABLES', () => {
    const system = Builder(config)('system');

    const varNode = buf('qCy/bc2tlLeQ4mL1e3DcRVnOtEKlNrJd9SRqruISYd4=');
    const valueA = buf('4oaYHzpku4ukG5WZVHYvvelyhgLi+VyzGhx7gUjHIqQ=');
    const valueB = buf('+sTdhiE2Ug1e/wddm7RyVMO82CdDRThznasEcXMzY5w=');

    let edge = system(VARIABLE_SET)([varNode, valueA]);
    b64(edge).should.equal(b64(E(varNode, valueA)));

    let value = system(VARIABLE_GET)(varNode);
    b64(value).should.equal(b64(valueA));

    edge = system(VARIABLE_SET)([varNode, valueB]);
    b64(edge).should.equal(b64(E(varNode, valueB)));

    value = system(VARIABLE_GET)(varNode);
    b64(value).should.equal(b64(valueB));
  });
});
