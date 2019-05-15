import { expect } from 'chai';

import { BinaryMap, CommandSystem } from './builder';

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

describe('CommandSystem', () => {
  it('should work', () => {
    const system = CommandSystem({
      ADD: (a, b) => a + b,
    });
    system('SUBTRACT', (a, b) => a - b);

    system('ADD')(123, 456).should.equal(579);
    system('SUBTRACT')(456, 123).should.equal(333);
  });
});
