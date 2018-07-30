import _ from 'lodash';
import stripIndent from 'strip-indent';

import { hashEdge } from './hash';

export const eachEdge = ([head, tail], callback) => {
  const split = (head, tail) => {
    if(_.isArray(head))
      head = split(head[0], head[1]);
    if(_.isArray(tail))
      tail = split(tail[0], tail[1]);

    callback([head, tail]);
    return hashEdge(head, tail);
  };

  split(head, tail);
};

export const block = str => stripIndent(str[0]).trim() + '\n';
