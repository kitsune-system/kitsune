import { Builder } from '@kitsune-system/kitsune-common';

import { bufferToBase64 as b64, deepHashEdge as E } from '../common/hash';
import { BASE64, BINARY, CONVERT } from '../common/nodes';
import { config } from '../kitsune/builder';

describe('Misc Commands', () => {
  it('should work', () => {
    const system = Builder(config)('system');

    const base64Str = 'QGCg0X7v9YFBDFt2X9P4cQfQdOozrrgo+zxQIttMl5I=';
    const buffer = system(E(CONVERT, E(BASE64, BINARY)))(base64Str);
    b64(buffer).should.equal(base64Str);
  });
});
