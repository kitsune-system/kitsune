import { base64ToBuffer as buf, bufferToBase64 as b64 } from '../common/hash';

export const tag = (fn, tags) => {
  Object.entries(tags).forEach(([key, value]) => {
    fn[key] = value;
  });
  return fn;
};

export const ArgCountSwitch = (...handlers) => {
  const fn = (...args) => {
    const count = args.length;
    const handle = handlers[count];

    if(typeof handle !== 'function')
      throw new Error(`No handler for arg count: ${count}`);

    return handle(...args);
  };

  fn.handlers = handlers;

  return fn;
};

export const BinaryMap = (base = {}) => {
  return ArgCountSwitch(
    () => base,
    binaryKey => {
      // In binaryKey is a function, iterate over the map
      if(typeof binaryKey === 'function') {
        return Object.entries(base).map(entry => {
          return binaryKey(buf(entry[0]), entry[1]);
        });
      }

      // Otherwise, normal `get()` use
      return base[b64(binaryKey)];
    },
    (binaryKey, value) => (base[b64(binaryKey)] = value),
  );
};

export const BinMap = BinaryMap;

export const BinaryObject = (...entries) => {
  const result = {};
  entries.forEach(([key, value]) => {
    result[b64(key)] = value;
  });
  return result;
};

export const BinObj = BinaryObject;

export const meta = (fn, metaMap) => {
  if(fn.meta)
    metaMap = BinaryMap({ ...fn.meta(), ...metaMap() });

  return tag(fn, { meta: metaMap });
};

export const Commands = (...commands) => {
  const result = BinaryMap();

  commands.forEach(([commandId, fn, metaMap]) => {
    const metaFn = metaMap ? meta(fn, metaMap) : fn;
    result(commandId, metaFn);
  });

  return result;
};

export const CommandInstaller = (system, systemModules, commandFn) => {
  let buildArgsObj = {};
  const wrapFns = [];

  const buildArgs = args => (buildArgsObj = { ...buildArgsObj, ...args });
  const wrap = fn => wrapFns.push(fn);

  const install = commandId => {
    // Do nothing if command is already installed
    if(b64(commandId) in system())
      return system(commandId);

    let fn = commandFn(commandId);

    if(!fn)
      throw new Error(`Can't find command for id: ${b64(commandId)}`);

    // Execute modules on command before adding to system
    if(typeof fn.meta === 'function') {
      fn.meta((moduleNode, value) => {
        const systemModule = systemModules(moduleNode);
        if(systemModule) {
          systemModule({
            fn, install, moduleNode, system, value,
            buildArgs, wrap,
          });
        }
      });

      // Build base fn
      fn = fn(buildArgsObj);
      // Wrap fn
      wrapFns.forEach(wrapFn => (fn = wrapFn(fn)));
    }

    system(commandId, fn);
    return fn;
  };

  return install;
};
