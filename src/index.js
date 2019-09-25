import { build } from './kitsune';
import * as env from './kitsune/env';

build('runFn')();

console.log('Environment:', { ...env });
