import { Builder } from '@kitsune-system/kitsune-common';
import { config } from './builder';

import { bufferToBase64 as b64, deepHashEdge as E } from '../common/hash';
import { COMMAND, LIST, SUPPORTS_COMMAND } from '../common/nodes';

it('SystemCommands', () => {
  const system = Builder(config)('system');

  system(SUPPORTS_COMMAND)(E(LIST, COMMAND)).should.be.true;
  system(SUPPORTS_COMMAND)(E(COMMAND, LIST)).should.be.false;

  system(E(LIST, COMMAND))().map(b64).should.contain(
    ...[SUPPORTS_COMMAND, E(LIST, COMMAND)].map(b64)
  );
});
