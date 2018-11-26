import { e } from './hash';
import { NAME, NODE, READ, RELATIVE, STRING, WRITE } from './nodes';
import System from './system';

const Names = baseSystem => {
  const system = System({ baseSystem });

  system.command(e(WRITE, NAME),
    [e(WRITE, STRING), e(WRITE, RELATIVE)],
    (writeString, writeRelative) => ({ node, name }) => {
      const strNode = writeString(name);
      return writeRelative({ nodes: [node, strNode], type: [NODE, NAME] });
    }
  );

  system.command(e(READ, [NODE, NAME]),
    [e(READ, RELATIVE), e(READ, STRING)],
    (readRelative, readString) => node => {
      const nameNodes = readRelative({ node, type: [NODE, NAME] });
      return nameNodes.map(nameNodes => readString(nameNodes));
    }
  );

  system.command(e(READ, [NAME, NODE]),
    [e(WRITE, STRING), e(READ, RELATIVE)],
    (writeString, readRelative) => name => {
      const node = writeString(name);
      return readRelative({ node, type: [NAME, NODE] });
    }
  );

  return system;
};

export default Names;
