import { bufferToBase64 as b64, hashEdge as E } from '../common/hash';
import { EDGE, WRITE } from '../common/nodes';
import { Builder, config } from '../kitsune/builder';

describe('edge-loki', () => {
  it('WRITE EDGE', () => {
    const system = Builder(config)('system');

    const edge = system(E(WRITE, EDGE))([WRITE, EDGE]);
    b64(edge).should.equal('ODU3RwsJsF9v2EddUOxOCixFGzOJ3fsEueULjRFa9dE=');
  });
});
