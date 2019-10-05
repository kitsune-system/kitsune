import {
  BUILT_IN_NODES, LOOKUP_NATIVE_NAME, LOOKUP_NATIVE_NODE, RANDOM,
} from '@kitsune-system/common';
import { NODES } from '../kitsune/nodes';
import { random } from './random';

const NAMES = {};
Object.entries(NODES).forEach(([name, nodeId]) => (NAMES[nodeId] = name));

export const coreConfig = {
  [BUILT_IN_NODES]: { fn: () => (_, output) => output(NODES) },
  [RANDOM]: { fn: () => (_, output) => output(random()) },

  [LOOKUP_NATIVE_NAME]: { fn: () => (nodeId, output) => output(NAMES[nodeId]) },
  [LOOKUP_NATIVE_NODE]: { fn: () => (name, output) => output(NODES[name]) },
};
