import { bufferToBase64 as b64, hashEdge as E, hashString } from '../kitsune/hash';
import { LIST, READ, STRING, WRITE } from '../kitsune/nodes';

const cleanResult = result => ({ id: result.id, string: result.string });

const StringCommands = strings => ({
  [b64(E(WRITE, STRING))]: string => {
    if(typeof string !== 'string')
      throw new Error('`string` must be a string');

    const node = hashString(string);

    const id = b64(node);
    const exists = (strings.by('id', id) !== undefined);
    if(!exists)
      strings.insert({ id, string });

    return node;
  },

  [b64(E(READ, STRING))]: node => {
    if(typeof node === 'string')
      throw new Error('`node` must be a buffer, not a string');

    const result = strings.by('id', b64(node));
    return cleanResult(result);
  },

  [b64(E(LIST, STRING))]: () => strings.find().map(cleanResult),
});

export default StringCommands;
