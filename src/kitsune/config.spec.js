import {
  deepHashEdge as E, COMMAND, LIST_V, SUPPORTS_COMMAND,
} from '@kitsune-system/common';

import { build } from './index';

it('SystemCommands', () => {
  const system = build('system');

  system(SUPPORTS_COMMAND)(E(LIST_V, COMMAND)).should.be.true;
  system(SUPPORTS_COMMAND)(E(COMMAND, LIST_V)).should.be.false;

  system(E(LIST_V, COMMAND))().should.contain(SUPPORTS_COMMAND, E(LIST_V, COMMAND));
});
