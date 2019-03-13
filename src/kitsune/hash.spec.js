import {
  bufferToBase64 as b64, deepHashEdge, hashEdge, hashString as hash,
} from './hash';
import { RANDOM, READ, WRITE } from './nodes';

describe('hash', () => {
  describe('hash(string)', () => {
    it('should convert strings to 256-bit base64 hash', () => {
      b64(hash('')).should.equal('p//G+L8e12ZRwUdWoGHWYvWA/03kO0n6gtgKS4D4Q0o=');
      b64(hash('Hello World')).should.equal('4Wf2jWVj11uyXzqknCnvYS1BNS3ABgbefL1jC7JmX1E=');
      b64(hash('こんにちは')).should.equal('IWqFEX1bVDMQDfh5Zw00xh8ij5txvAxYzJoeb0nnQVY=');

      b64(hash(Buffer.from(''))).should.equal('p//G+L8e12ZRwUdWoGHWYvWA/03kO0n6gtgKS4D4Q0o=');
      b64(hash(Buffer.from('Hello World'))).should.equal('4Wf2jWVj11uyXzqknCnvYS1BNS3ABgbefL1jC7JmX1E=');
      b64(hash(Buffer.from('こんにちは'))).should.equal('IWqFEX1bVDMQDfh5Zw00xh8ij5txvAxYzJoeb0nnQVY=');

      b64(hash(Buffer.from('', 'utf8'))).should.equal('p//G+L8e12ZRwUdWoGHWYvWA/03kO0n6gtgKS4D4Q0o=');
      b64(hash(Buffer.from('Hello World', 'utf8'))).should.equal('4Wf2jWVj11uyXzqknCnvYS1BNS3ABgbefL1jC7JmX1E=');
      b64(hash(Buffer.from('こんにちは', 'utf8'))).should.equal('IWqFEX1bVDMQDfh5Zw00xh8ij5txvAxYzJoeb0nnQVY=');
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
