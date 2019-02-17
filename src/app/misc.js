import { e, random } from './hash';
import { READ, RANDOM } from './nodes';
import System from './system';

const Misc = System();

Misc.command(e(READ, RANDOM), random);

export default Misc;
