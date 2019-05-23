import { expect } from 'chai';

import { ArgCountSwitch, BinaryMap } from '../kitsune/util';

describe('ArgCountSwitch', () => {
  it('should work', () => {
    const fn = ArgCountSwitch(
      () => 'Hello',
      first => `${first} world`,
      (first, second) => `${second} again ${first}`,
      null,
      (...list) => list.reverse(),
    );

    fn().should.equal('Hello');
    fn('one').should.equal('one world');
    fn(1, 'two').should.equal('two again 1');
    (() => {
      fn('a', 'b', 'c');
    }).should.throw();
    fn(...[1, 2, 3, 4]).should.deep.equal([4, 3, 2, 1]);
    (() => {
      fn(...'qwert'.split(''));
    }).should.throw();
  });
});

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
