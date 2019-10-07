import { homedir } from 'os';
import { join } from 'path';

import { deepHashEdge as E, hashString, READ, WRITE, STRING } from '@kitsune-system/common';
import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';

const STRING_DB = 'CoCIvqtheW3QWXYt0CvzjWvSdjAUA3G1bu8N8xTwWt4=';

export const coreConfig = {
  [STRING_DB]: {
    fn: () => (_, output) => {
      console.log('INIT String DB');

      // TODO: Fix this to use KITSUNE_PATH instead
      const dataPath = join(homedir(), '.kitsune');
      mkdirp(dataPath);

      const db = new sqlite3.Database(join(dataPath, 'string.sqlite3'));

      db.run(`CREATE TABLE IF NOT EXISTS string (
        id TEXT PRIMARY KEY,
        string TEXT NOT NULL
      )`, () => output(db));
    },
  },
  [E(WRITE, STRING)]: {
    fn: ({ db }) => (string, output) => {
      const id = hashString(string);

      db.run(
        'INSERT INTO string VALUES (?, ?) ON CONFLICT(id) DO NOTHING',
        id, string,
        () => output(id)
      );
    },
    inject: { db: STRING_DB },
  },
  [E(READ, STRING)]: {
    fn: ({ db }) => (id, output) => {
      db.get(
        'SELECT string FROM string WHERE id = ?', id,
        (_, result) => output(result)
      );
    },
    inject: { db: STRING_DB },
  },
};
