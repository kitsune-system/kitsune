import {
  bufferToBase64 as b64, deepHashEdge, hashEdge, hashString as hash, pseudoRandom,
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

  it('pseudoRandom', () => {
    const random = pseudoRandom(RANDOM);

    b64(random()).should.equal('MF7Yc6gRuVWrfWR0Cs9VKAoqTcVsMfdWeXmcjAE3goU=');
    b64(random()).should.equal('ZE5nfIvBE892Mh0ZiMAF6bYN13Ec8xovE2S15y9XrjU=');
    b64(random()).should.equal('PFdJkeCnbCZzBF+bLC0Fb7vCRwbFKfv8hBwz6wH7yjk=');
    b64(random()).should.equal('j36ZUZQjVbthdwf3jL5eubGhZTYY/93+AbGyTivU2TY=');
    b64(random()).should.equal('uo587Bpkiy1hLGJ+JIwO4QZxrHKrdcVA3gY1FyWyb/c=');
  });
});
