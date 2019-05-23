import { bufferToBase64 as b64, hashEdge as E, hashString } from '../common/hash';
import { LIST, READ, STRING, WRITE } from '../common/nodes';

import { Commands } from '../kitsune/util';

const cleanResult = result => ({ id: result.id, string: result.string });

export const StringCommands = strings => Commands(
  [E(WRITE, STRING), string => {
    if(typeof string !== 'string')
      throw new Error('`string` must be a string');

    const node = hashString(string);

    const id = b64(node);
    const exists = (strings.by('id', id) !== undefined);
    if(!exists)
      strings.insert({ id, string });

    return node;
  }],

  [E(READ, STRING), node => {
    if(typeof node === 'string')
      throw new Error('`node` must be a buffer, not a string');

    const result = strings.by('id', b64(node));
    return result.string;
  }],

  [E(LIST, STRING), () => strings.find().map(cleanResult)],
);

export const buildConfig = {
  stringCollection: build => build('lokiDB').addCollection('strings', {
    unique: ['id'],
    indicies: ['string'],
  }),
  stringCommands: build => StringCommands(build('stringCollection')),
};
