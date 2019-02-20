import { bufferToBase64 as b64, random } from '../kitsune/hash';
import { RANDOM } from '../kitsune/nodes';
import { CommonSystem as System } from '../system/builder';

const app = System({
  [b64(RANDOM)]: random,
});

export default app;
