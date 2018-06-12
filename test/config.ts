export const userA = {
  email: 'a',
  password: 'a',
  fullName: 'a a',
  id: undefined,
  token: undefined
}
export const userB = {
  email: 'b',
  password: 'b',
  fullName: 'b b',
  id: undefined,
  token: undefined
}

export const trustA = {
  name: 'A trust',
  key: encodeURIComponent('A trust'),
  description: 'idk'
}

import * as chai from 'chai';
import * as chaiHttp from 'chai-http';
chai.use(chaiHttp);
export const request = chai.request('http://localhost:4000');
