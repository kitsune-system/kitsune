import { hash, hashEdge, hashList, hexToBase64, random } from './hash';
import { EDGE, READ, WRITE } from './nodes';

describe('hash', () => {
  describe('hash(string)', () => {
    it('should convert strings to 256-bit base64 hash', () => {
      hash('').should.equal('p//G+L8e12ZRwUdWoGHWYvWA/03kO0n6gtgKS4D4Q0o=');
      hash('Hello World').should.equal('4Wf2jWVj11uyXzqknCnvYS1BNS3ABgbefL1jC7JmX1E=');
      hash('こんにちは').should.equal('IWqFEX1bVDMQDfh5Zw00xh8ij5txvAxYzJoeb0nnQVY=');

      hash(Buffer.from('')).should.equal('p//G+L8e12ZRwUdWoGHWYvWA/03kO0n6gtgKS4D4Q0o=');
      hash(Buffer.from('Hello World')).should.equal('4Wf2jWVj11uyXzqknCnvYS1BNS3ABgbefL1jC7JmX1E=');
      hash(Buffer.from('こんにちは')).should.equal('IWqFEX1bVDMQDfh5Zw00xh8ij5txvAxYzJoeb0nnQVY=');

      hash(Buffer.from('', 'utf8')).should.equal('p//G+L8e12ZRwUdWoGHWYvWA/03kO0n6gtgKS4D4Q0o=');
      hash(Buffer.from('Hello World', 'utf8')).should.equal('4Wf2jWVj11uyXzqknCnvYS1BNS3ABgbefL1jC7JmX1E=');
      hash(Buffer.from('こんにちは', 'utf8')).should.equal('IWqFEX1bVDMQDfh5Zw00xh8ij5txvAxYzJoeb0nnQVY=');
    });
  });

  describe('hexToBase64(hex)', () => {
    it('should convert hex string to base64 string', () => {
      const result = hexToBase64('11223344556677889900aabbccddeeff');
      result.should.equal('ESIzRFVmd4iZAKq7zN3u/w==');
    });
  });

  describe('random()', () => {
    it('should generate a random 256-bit base64 hash', () => {
      const hash = random();
      hash.length.should.equal(44);
    });
  });

  describe('hashList', () => {
    it('should hash a two element array', () => {
      hashList([
        WRITE,
        READ,
        EDGE,
      ]).should.equal('pnNh2P4C9sucF5ZlUz/RLQlglCykDXarDxnQg6w9yZk=');

      // These should all work the same
      hashList([
        'hello123',
        'world123',
        'again123',
      ]).should.equal('1+bSJVRqG8uTgzWVFmzptJBxzTXo1HZpuV0AIWRxZnU=');

      hashList(['hello123world123again123']).should.equal('1+bSJVRqG8uTgzWVFmzptJBxzTXo1HZpuV0AIWRxZnU=');

      hash(Buffer.from('hello123world123again123', 'base64')).should.equal('1+bSJVRqG8uTgzWVFmzptJBxzTXo1HZpuV0AIWRxZnU=');
    });

    it('should hash a deep array', () => {
      const readEdge = hashEdge(READ, EDGE);
      const edge = hashEdge(WRITE, readEdge);

      // Can pass two arguments ...
      hashEdge(WRITE, [READ, EDGE]).should.equal(edge);
      // ... or an array with two elements
      hashEdge([WRITE, [READ, EDGE]]).should.equal(edge);
    });
  });
});
