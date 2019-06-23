import { ArgCountSwitch, b64, buf } from '.';

const BinaryMap = (base = {}) => {
  const map = ArgCountSwitch(
    () => base,
    binaryKey => {
      // In binaryKey is a function, iterate over the map
      if(typeof binaryKey === 'function') {
        // eslint-disable-next-line guard-for-in
        for(const key in base) {
          const value = base[key];
          binaryKey(buf(key), value);
        }
      }

      // Otherwise, normal `get()` use
      return base[b64(binaryKey)];
    },
    (binaryKey, value) => (base[b64(binaryKey)] = value),
  );

  map.delete = binaryKey => delete base[b64(binaryKey)];

  return map;
};

export default BinaryMap;
