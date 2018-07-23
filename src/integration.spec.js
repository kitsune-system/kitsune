import './spec-common';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1126'
});

api.interceptors.response.use(null, error => error);

describe('integration specs', () => {
  it('should work', async() => {
    const result = await api.get('/1234');
    result.data.should.eql('Hello 1234!!');
  });
});
