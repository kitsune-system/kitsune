import _ from 'lodash';

import { e } from './hash';
import { ALL, COMMAND, IS, READ, SUPPORTED } from './nodes';
import { onNotFoundDefault } from './system';

const isSupported = e(READ, [IS, [SUPPORTED, COMMAND]]);
const allCommands = e(READ, [ALL, [SUPPORTED, COMMAND]]);

// eslint-disable-next-line no-warning-comments
// TODO: Can we do better to clean this up and reuse logic from `system.js`?
const MultiSystem = () => {
  const systems = [];

  const localCommands = {
    [isSupported]: (...args) => _.some(systems, system => system(isSupported, args)),
    [allCommands]: () => _.uniq(_.flatMap(systems, system => system(allCommands)))
  };

  const result = (...args) => {
    const [commandId, input] = args;
    if(localCommands[commandId])
      return localCommands[commandId](input);

    const system = systems.find(system => system(isSupported, args));
    if(!system)
      onNotFoundDefault(result, ...args);

    return system(...args);
  };

  result.push = system => systems.push(system);

  return result;
};

export default MultiSystem;
