import { b64, buf } from '.';

const BinarySet = () => {
  const base = new Set();

  const set = {};

  set.has = buffer => base.has(b64(buffer));
  set.add = buffer => base.add(b64(buffer));
  set.delete = buffer => base.delete(b64(buffer));

  set.union = other => {
    const result = BinarySet();
    const resultSet = result.toSet();

    set.toSet().forEach(item => resultSet.add(item));
    other.toSet().forEach(item => resultSet.add(item));

    return result;
  };

  set.difference = other => {
    const result = BinarySet();
    const resultSet = result.toSet();

    set.toSet().forEach(item => resultSet.add(item));
    other.toSet().forEach(item => resultSet.delete(item));

    return result;
  };

  set.intersection = other => {
    const result = BinarySet();
    const resultSet = result.toSet();

    const setSet = set.toSet();
    const otherSet = other.toSet();

    let bigSet;
    let smallSet;
    if(setSet.size > otherSet.size) {
      bigSet = setSet;
      smallSet = otherSet;
    } else {
      bigSet = otherSet;
      smallSet = setSet;
    }

    smallSet.forEach(item => {
      if(bigSet.has(item))
        resultSet.add(item);
    });

    return result;
  };

  set.clone = () => {
    const result = BinarySet();
    set.forEach(result.add);
    return result;
  };

  set.forEach = fn => set.toSet().forEach(item => fn(buf(item)));
  set.toSet = () => base;

  return set;
};

export default BinarySet;
