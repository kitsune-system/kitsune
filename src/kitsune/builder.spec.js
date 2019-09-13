import { Builder } from '@gamedevfox/katana';
import {
  deepHashEdge as E, COMMAND, LIST, SUPPORTS_COMMAND,
} from '@kitsune-system/common';

import { config } from './builder';

it('SystemCommands', () => {
  const system = Builder(config)('system');

  system(SUPPORTS_COMMAND)(E(LIST, COMMAND)).should.be.true;
  system(SUPPORTS_COMMAND)(E(COMMAND, LIST)).should.be.false;

  system(E(LIST, COMMAND))().should.contain(SUPPORTS_COMMAND, E(LIST, COMMAND));
});
