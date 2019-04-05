import { easyWrite, readJson } from './files';

describe('files', () => {
  it('should work', async() => {
    const path = '/tmp/hello/world/again.txt';
    const data = { a: 123, b: 'three four five' };

    await easyWrite(path, data);
    const myData = await readJson(path);

    myData.should.deep.equal(data);
  });
});
