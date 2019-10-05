import { deepHashEdge as E, WRITE, LIST_N, READ } from '@kitsune-system/common';

import { build } from '../kitsune';

describe('LIST_N', () => {
  it('should be able to READ and WRITE a LIST_N', () => {
    const system = build('system');

    const list = [
      'SesKsezJ9L67JVvbZ+NWve+8yDK5Isy6GVuCtq7wNV4=',
      '8bCbJoxOn8PujH9uLWX8xqb+xw6XBLEzobQ/aiahYnY=',
      'WT1q120nPK7V3uJkOu+1XHYclnPawrB95tybJwGQBks=',
    ];

    let listNode = system(E(WRITE, LIST_N))(list);
    listNode.should.equal('Pwyn6+nPw2AxIpaXHun28RmXw2JoAiTA9//hUMS8tTM=');

    let myList = system(E(READ, LIST_N))(listNode);
    myList.should.deep.equal(list);

    listNode = system(E(WRITE, LIST_N))(list.slice().reverse());
    listNode.should.equal('QSLHYUgYV9EC5ZVYy0HItdhNPMvzIlUlA0usWB7ezxU=');

    myList = system(E(READ, LIST_N))(listNode);
    myList.should.deep.equal(list.slice().reverse());
  });
});
