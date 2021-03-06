import {
  deepHashEdge as E, hashString, noOp, LIST_V, READ, STRING, WRITE,
} from '@kitsune-system/common';

import { Commands } from '../kitsune/util';

const cleanResult = result => ({ id: result.id, string: result.string });

export const StringCommands = strings => Commands(
  [E(WRITE, STRING), (string, output = noOp) => {
    if(typeof string !== 'string')
      throw new Error('`string` must be a string');

    const node = hashString(string);

    const id = node;
    const exists = (strings.by('id', id) !== undefined);
    if(!exists)
      strings.insert({ id, string });

    output(node);
    return node;
  }],

  [E(READ, STRING), node => {
    if(typeof node === 'string')
      throw new Error('`node` must be a buffer, not a string');

    const result = strings.by('id', node);
    return result.string;
  }],

  [E(LIST_V, STRING), () => strings.find().map(cleanResult)],
);

export const buildConfig = {
  stringCollection: build => build('lokiDB').addCollection('strings', {
    unique: ['id'],
    indicies: ['string'],
  }),
};
