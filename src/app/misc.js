import { e, random } from './hash';
import { READ, RANDOM } from './nodes';
import System from './system';

const Misc = systemId => {
  const system = System(systemId);

  system.command(e(READ, RANDOM), random);

  return system;
};

export default Misc;
