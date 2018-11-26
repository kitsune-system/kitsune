import { e, hashEdge } from './hash';
import { DEEP, EDGE, READ, RELATIVE, SYSTEM, TAIL, WRITE } from './nodes';
import System from './system';

const Relatives = baseSystem => {
  const relatives = System({ baseSystem, id: e(RELATIVE, SYSTEM) });

  relatives.command(e(WRITE, RELATIVE),
    [e(WRITE, [DEEP, EDGE])],
    writeDeepEdge => ({ nodes, type }) => {
      let typeA, typeB;
      if(typeof type === 'string')
        [typeA, typeB] = [type, type];
      else
        [typeA, typeB] = type;

      const [nodeA, nodeB] = nodes;

      const relEdgeA = writeDeepEdge([[nodeA, [typeA, typeB]], nodeB]);
      const relEdgeB = writeDeepEdge([[nodeB, [typeB, typeA]], nodeA]);

      return [relEdgeA, relEdgeB];
    }
  );

  relatives.command(e(READ, RELATIVE),
    [e(READ, TAIL)],
    readTails => ({ node, type }) => {
      if(typeof type === 'string')
        type = hashEdge(type, type);

      const edge = hashEdge(node, type);
      return readTails(edge);
    }
  );

  return relatives;
};

export default Relatives;
