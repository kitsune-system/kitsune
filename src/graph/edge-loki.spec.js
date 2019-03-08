import build from '../kitsune/builder';
import { bufferToBase64 as b64, hashEdge as E } from '../kitsune/hash';
import { EDGE, WRITE } from '../kitsune/nodes';

describe.only('edge-loki', () => {
  before(() => {
    console.log('BEFORE');
  });

  it('WRITE EDGE', () => {
    const system = build('edge');
    const edge = system(E(WRITE, EDGE), [WRITE, EDGE]);
    b64(edge).should.equal("ODU3RwsJsF9v2EddUOxOCixFGzOJ3fsEueULjRFa9dE=");
  });
});
