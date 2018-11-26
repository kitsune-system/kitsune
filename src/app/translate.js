/* eslint-disable no-warning-comments */

import { e, names } from './hash';
import { CONVERT, DEEP, EDGE, NAME, NESTED, NODE, READ } from './nodes';
import System from './system';

const deepNameMap = input => {
  const isNode = (typeof input === 'string');
  // TODO: Replace `names[input]` with readName on a baseSystem
  return isNode ? (names[input] || input) : input.map(deepNameMap);
};

const Translate = baseSystem => {
  const system = System({ baseSystem });

  // TODO: Make a readDeepEdges command to go along with writeDeepEdges ???
  system.command(e(CONVERT, [NODE, [NESTED, EDGE]]),
    [e(READ, EDGE)],
    readEdge => node => {
      const expand = node => {
        const edge = readEdge(node);
        return edge ? edge.map(expand) : node;
      };

      return expand(node);
    }
  );

  system.command(e(DEEP, [CONVERT, [NODE, NAME]]), deepNameMap);

  system.command(e(CONVERT, [NODE, [NESTED, NAME]]),
    [e(CONVERT, [NODE, [NESTED, EDGE]])],
    node2Edges => input => deepNameMap(node2Edges(input))
  );

  return system;
};

export default Translate;
