import { expect } from 'chai';

import { builder } from './builder';

describe('builder', () => {
  it('should build', () => {
    const myBuilder = builder({
      hello: 'world',
      test: () => 10 + 20,
      msg: build => `The ${build('hello')} has ${build('test')} people... that's ${build('test')}!!!`,
      random: () => Math.random(),
    });

    expect(myBuilder('hello')).to.equal('world');
    expect(myBuilder('test')).to.equal(30);
    expect(myBuilder('msg')).to.equal('The world has 30 people... that\'s 30!!!');
    expect(myBuilder('random')).to.equal(myBuilder('random'));

    expect(myBuilder('not-found')).to.be.undefined;
  });
});
