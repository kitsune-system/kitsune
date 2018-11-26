import _ from 'lodash';

import { e } from './hash';
import { DEEP, EDGE, WRITE } from './nodes';
import System from './system';

const DeepEdges = baseSystem => {
  const system = System({ baseSystem, id: e(DEEP, EDGE) });

  system.command(e(WRITE, [DEEP, EDGE]),
    [e(WRITE, EDGE)],
    writeEdge => ([head, tail]) => {
      const writeDeepEdge = (head, tail) => {
        if(_.isArray(head))
          head = writeDeepEdge(head[0], head[1]);
        if(_.isArray(tail))
          tail = writeDeepEdge(tail[0], tail[1]);

        return writeEdge([head, tail]);
      };

      return writeDeepEdge(head, tail);
    }
  );

  return system;
};

export default DeepEdges;
