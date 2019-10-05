import { homedir } from 'os';
import { join } from 'path';

import { deepHashEdge as E, hashString, READ, WRITE, STRING } from '@kitsune-system/common';
import mkdirp from 'mkdirp';
import sqlite3 from 'sqlite3';

const STRING_DB = 'STRING_DB';

let dbValue;

export const coreConfig = {
  [STRING_DB]: {
    fn: () => (_, output) => {
      if(dbValue)
        output(dbValue);
      else {
        // TODO: Fix this so that's it's not build multiple times

        // TODO: Fix this to use KITSUNE_PATH instead
        const dataPath = join(homedir(), '.kitsune');
        mkdirp(dataPath);

        dbValue = new sqlite3.Database(join(dataPath, 'string.sqlite3'));

        dbValue.run(`CREATE TABLE IF NOT EXISTS string (
          id TEXT PRIMARY KEY,
          string TEXT NOT NULL
        )`, () => output(dbValue));
      }
    },
  },
  [E(WRITE, STRING)]: {
    fn: ({ db }) => (string, output) => {
      db(null, db => {
        const id = hashString(string);

        db.run(
          'INSERT INTO string VALUES (?, ?) ON CONFLICT(id) DO NOTHING',
          id, string,
          () => output(id)
        );
      });
    },
    bind: { db: STRING_DB },
  },
  [E(READ, STRING)]: {
    fn: ({ db }) => (id, output) => {
      db(null, db => {
        db.get(
          'SELECT string FROM string WHERE id = ?', id,
          (_, result) => output(result)
        );
      });
    },
    bind: { db: STRING_DB },
  },
};
