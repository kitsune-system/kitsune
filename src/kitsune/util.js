import { Map } from '@gamedevfox/katana';

export const tag = (fn, tags) => {
  Object.entries(tags).forEach(([key, value]) => {
    fn[key] = value;
  });
  return fn;
};

export const meta = (fn, metaMap) => {
  if(fn.meta)
    metaMap = Map({ ...fn.meta(), ...metaMap() });

  return tag(fn, { meta: metaMap });
};

export const Commands = (...commands) => {
  const result = Map();

  commands.forEach(([commandId, fn, metaMap]) => {
    const metaFn = metaMap ? meta(fn, metaMap) : fn;
    result(commandId, metaFn);
  });

  return result;
};
