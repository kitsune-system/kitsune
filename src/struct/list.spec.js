import { Builder } from 'kitsune-common';

import {
  base64ToBuffer as buf, bufferToBase64 as b64, deepHashEdge as E,
} from '../common/hash';
import { WRITE, LIST_N, READ } from '../common/nodes';
import { config } from '../kitsune/builder';

describe('LIST', () => {
  it('should be able to READ and WRITE a LIST', () => {
    const system = Builder(config)('system');

    const list = [
      buf('SesKsezJ9L67JVvbZ+NWve+8yDK5Isy6GVuCtq7wNV4='),
      buf('8bCbJoxOn8PujH9uLWX8xqb+xw6XBLEzobQ/aiahYnY='),
      buf('WT1q120nPK7V3uJkOu+1XHYclnPawrB95tybJwGQBks='),
    ];

    let listNode = system(E(WRITE, LIST_N))(list);
    b64(listNode).should.equal('Pwyn6+nPw2AxIpaXHun28RmXw2JoAiTA9//hUMS8tTM=');

    let myList = system(E(READ, LIST_N))(listNode);
    myList.map(b64).should.deep.equal(list.map(b64));

    listNode = system(E(WRITE, LIST_N))(list.slice().reverse());
    b64(listNode).should.equal('QSLHYUgYV9EC5ZVYy0HItdhNPMvzIlUlA0usWB7ezxU=');

    myList = system(E(READ, LIST_N))(listNode);
    myList.map(b64).should.deep.equal(list.slice().reverse().map(b64));
  });
});
