import { Builder } from '@gamedevfox/katana';
import { config } from './kitsune/builder';

const run = Builder(config)('runFn');
run();
