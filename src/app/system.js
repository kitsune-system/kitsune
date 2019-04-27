import { hasCommand, listCommands, translate } from './edge-nodes';

export const onNotFoundDefault = (baseSystem, commandId) => {
  const canTranslate = baseSystem && baseSystem(hasCommand, [translate]);
  const command = canTranslate ? baseSystem(translate, commandId) : commandId;

  const error = new Error(`This system doesn't support command: ${JSON.stringify(command)}`);
  error.command = command;
  error.commandId = commandId;
  throw error;
};

const System = ({ id, baseSystem, onNotFound } = {}) => {
  const systemMap = {};
  const notFoundFn = onNotFound || onNotFoundDefault;

  const system = (commandId, input) => {
    const sys = systemMap[commandId];

    if(!sys)
      notFoundFn(baseSystem, commandId, input);

    return sys(input);
  };

  // System id
  system.id = id;

  const command = (...args) => {
    let commandId, deps, func;

    if(args.length === 2)
      [commandId, func] = args;
    else if(args.length === 3)
      [commandId, deps, func] = args;
    else
      throw new Error(`Wrong number of arguments: ${args}`);

    if(deps) {
      // Validate deps
      const boundDeps = [];
      const notSupported = [];

      deps.forEach(dep => {
        const isLocal = system(hasCommand, [dep]);
        if(!isLocal) {
          let found = false;
          if(baseSystem)
            found = baseSystem(hasCommand, [dep]);

          if(!found) {
            notSupported.push(dep);
            return;
          }
        }

        const sys = isLocal ? system : baseSystem;
        boundDeps.push(input => sys(dep, input));
      });

      if(notSupported.length > 0) {
        let commands = notSupported;

        const canTranslate = baseSystem(hasCommand, [translate]);
        if(canTranslate)
          commands = notSupported.map(commandId => baseSystem(translate, commandId));

        const error = new Error('The following commands are not supported on the base system: ' +
          JSON.stringify(commands));
        error.commands = commands;
        error.commandIds = notSupported;
        throw error;
      }

      func = func(...boundDeps);
    }

    systemMap[commandId] = func;
  };

  system.command = command;

  command(hasCommand, ([commandId]) => systemMap[commandId] !== undefined);
  command(listCommands, () => Object.keys(systemMap));

  return system;
};

export default System;
