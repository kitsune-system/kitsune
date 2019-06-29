import { Builder } from '@kitsune-system/kitsune-common';
import { config } from './kitsune/builder';

const run = Builder(config)('runFn');
run();
