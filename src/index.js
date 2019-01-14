import _ from 'lodash';
import { execSync } from 'child_process';

import app from './app';

import * as nodes from './app/nodes';
_.each(nodes, (node, name) => {
  console.log(name, node);
});
console.log();

// Config
const { env } = process;
const port = env.KITSUNE_PORT || 8080;
const onStarted = env.KITSUNE_ON_STARTED;

const listener = app.listen(port, () => {
  const { port } = listener.address();
  console.log(`Kitsune service started on port ${port} ...`);

  if(onStarted) {
    const buffer = execSync(onStarted);
    console.log(buffer.toString());
  }
});
