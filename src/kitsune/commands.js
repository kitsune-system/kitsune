import { Map } from '@gamedevfox/katana';
import {
  deepHashEdge as E, BUILT_IN_NODES, COMMAND, LIST, SUPPORTS_COMMAND,
} from '@kitsune-system/common';

import { StringCommands } from '../data/string-loki';
import { EdgeCommands } from '../graph/edge-loki';
import ListCommands from '../struct/list';
import MapCommands from '../struct/map';
import SetCommands from '../struct/set';
import VariableCommands from '../struct/variable';

import { NODES } from './nodes';
import MiscCommands from './misc';
import { Commands } from './util';

const SystemCommands = system => Commands(
  // TODO: Bind system to these two
  [SUPPORTS_COMMAND, commandId => commandId in system()],
  [E(LIST, COMMAND), () => Object.keys(system())],

  [BUILT_IN_NODES, () => NODES],
);

const commands = {
  systemCommands: build => SystemCommands(build('system')),
  miscCommands: build => MiscCommands(build('system')),

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
    const result = Map();

    const commandList = build('commandList');
    commandList.forEach(buildName => {
      const commands = build(buildName);
      commands((node, fn) => result(node, fn));
    });

    return result;
  },
};
