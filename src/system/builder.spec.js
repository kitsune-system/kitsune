import { expect } from 'chai';

import { BinaryMap, CommonSystem } from './builder';
import { deepHashEdge as E } from '../common/hash';
import { COMMAND, LIST, SUPPORTS_COMMAND } from '../common/nodes';

describe('BinaryMap', () => {
  it('should work', () => {
    // Constructor can be empty
    BinaryMap()().should.deep.equal({});

    const initial = { abc: 123 };
    const map = BinaryMap(initial);

    // Should not contain a reference to the initial object
    map().should.deep.equal(initial);

    map('abc').should.equal(123);
    expect(map('another')).to.be.undefined;

    map('another', 'one');
    map('another').should.equals('one');

    map().should.deep.equal({
      abc: 123,
      another: 'one',
    });
  });
});

describe('CommonSystem', () => {
  it('should work', () => {
    const system = CommonSystem({
      ADD: (a, b) => a + b,
    });
    system('SUBTRACT', (a, b) => a - b);

    system('ADD')(123, 456).should.equal(579);
    system('SUBTRACT')(456, 123).should.equal(333);

    system(SUPPORTS_COMMAND)('ADD').should.deep.equal(true);
    system(SUPPORTS_COMMAND)('MISSING').should.deep.equal(false);
    system(E(LIST, COMMAND))().length.should.equal(4);
  });
});
