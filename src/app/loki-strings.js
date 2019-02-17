import Loki from 'lokijs';

import { e, hash } from './hash';
import { READ, STRING, WRITE } from './nodes';
import System from './system';

const LokiStrings = systemId => {
  const db = new Loki();
  const strings = db.addCollection('string', {
    unique: ['id'],
    indicies: ['string'],
  });

  const system = System(systemId);

  system.command(e(WRITE, STRING), string => {
    const id = hash(string);

    const exists = (strings.by('id', id) !== undefined);
    if(!exists)
      strings.insert({ id, string });

    return id;
  });

  system.command(e(READ, STRING), node => {
    const result = strings.by('id', node);
    return result.string;
  });

  return system;
};

export default LokiStrings;
