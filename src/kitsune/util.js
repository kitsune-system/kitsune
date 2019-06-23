import { BinaryMap, b64 } from '../common';

export const tag = (fn, tags) => {
  Object.entries(tags).forEach(([key, value]) => {
    fn[key] = value;
  });
  return fn;
};

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
