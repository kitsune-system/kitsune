import { b64, buf } from '.';

import BinarySet from './binary-set';

it('BinarySet', () => {
  const TEST_A = buf('nHXaNugF1n5HgQZZiyYDOVqw854qTFWkIyETJLOyAo8=');
  const TEST_B = buf('copGvZpWL3fwDzhw19HAlUktpGOFbqClwisL7oJ/m78=');
  const TEST_C = buf('ojYaoIUFA42tHTrfaKorVgBei5SwJflxKGH7lmbPWa0=');
  const TEST_D = buf('Ki1M2jXnC/MkIEv/v868cLPUFaT9UVJW7BXRDO3j/4k=');

  // Constructor can be empty
  let set = BinarySet();
  Array.from(set.toSet()).should.have.members([]);

  set = BinarySet();
  [TEST_A, TEST_B, TEST_C].map(set.add);
  Array.from(set.toSet()).should.have.members([TEST_A, TEST_B, TEST_C].map(b64));

  set.has(TEST_A).should.be.true;
  set.has(TEST_B).should.be.true;
  set.has(TEST_C).should.be.true;
  set.has(TEST_D).should.be.false;

  set.delete(TEST_A);
  set.add(TEST_D);
  Array.from(set.toSet()).should.have.members([TEST_B, TEST_C, TEST_D].map(b64));

  const set2 = BinarySet();
  [TEST_A, TEST_B, TEST_C].map(set2.add);

  const union = Array.from(set.union(set2).toSet());
  union.should.have.members([TEST_A, TEST_B, TEST_C, TEST_D].map(b64));

  const difference = Array.from(set.difference(set2).toSet());
  difference.should.have.members([TEST_D].map(b64));

  const intersection = Array.from(set.intersection(set2).toSet());
  intersection.should.have.members([TEST_B, TEST_C].map(b64));

  const items = [];
  set.forEach(item => items.push(item));

  items.map(b64).should.deep.equal([TEST_B, TEST_C, TEST_D].map(b64));
});
