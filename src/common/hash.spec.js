import {
  bufferToBase64 as b64, deepHashEdge, hashEdge, hashString as hash,
} from './hash';
import { RANDOM, READ, WRITE } from './nodes';

describe('hash', () => {
  describe('hash(string)', () => {
    it('should convert strings to 256-bit base64 hash', () => {
      b64(hash('')).should.equal('gRB6Zjl2BgkHSbynpo4AH4MEBlCFGdQbaXKrUsNyRQs=');
      b64(hash('Hello World')).should.equal('mHjKZqSLLbx1kM953E3UyNW/5oWNOBhNPbNtD9dTJXk=');
      b64(hash('こんにちは')).should.equal('2vG7X2iRbp+0/ff82VOXOD2ZzvShhR+wSkxTiJk+eSA=');

      b64(hash(Buffer.from(''))).should.equal('gRB6Zjl2BgkHSbynpo4AH4MEBlCFGdQbaXKrUsNyRQs=');
      b64(hash(Buffer.from('Hello World'))).should.equal('mHjKZqSLLbx1kM953E3UyNW/5oWNOBhNPbNtD9dTJXk=');
      b64(hash(Buffer.from('こんにちは'))).should.equal('2vG7X2iRbp+0/ff82VOXOD2ZzvShhR+wSkxTiJk+eSA=');

      b64(hash(Buffer.from('', 'utf8'))).should.equal('gRB6Zjl2BgkHSbynpo4AH4MEBlCFGdQbaXKrUsNyRQs=');
      b64(hash(Buffer.from('Hello World', 'utf8'))).should.equal('mHjKZqSLLbx1kM953E3UyNW/5oWNOBhNPbNtD9dTJXk=');
      b64(hash(Buffer.from('こんにちは', 'utf8'))).should.equal('2vG7X2iRbp+0/ff82VOXOD2ZzvShhR+wSkxTiJk+eSA=');
    });
  });

  describe('deepHashEdge', () => {
    it('should edge hash a nested array of nodes', () => {
      const normal = hashEdge(RANDOM, hashEdge(READ, WRITE));
      const deep = deepHashEdge(RANDOM, [READ, WRITE]);

      deep.equals(normal).should.be.true;
    });
  });
});
