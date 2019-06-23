import { expect } from 'chai';

import BinaryMap from './binary-map';

describe('BinaryMap', () => {
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
