import { Core } from '@kitsune-system/common';

import { coreConfig, RUN } from './kitsune';

Core(coreConfig, core => {
  core(RUN, run => run());
});
