import { Map } from '@gamedevfox/katana';

import { StringCommands } from '../data/string-loki';
import { EdgeCommands } from '../graph/edge-loki';
import { ListCommands } from '../struct/list';
import { MapCommands } from '../struct/map';
import { SetCommands } from '../struct/set';
import { VariableCommands } from '../struct/variable';

const commands = {
  edgeCommands: build => EdgeCommands(build('graph')),
  stringCommands: build => StringCommands(build('stringCollection')),

  listCommands: () => ListCommands,
  setCommands: () => SetCommands,
  mapCommands: () => MapCommands,
  variableCommands: () => VariableCommands,
};

export const buildConfig = {
  ...commands,
  commandList: Object.keys(commands),

  commands: build => {
    const commands = Map();

    const commandList = build('commandList');
    commandList.forEach(moduleName => {
      const moduleCommands = build(moduleName);
      moduleCommands.each(commands);
    });

    return commands;
  },
};
