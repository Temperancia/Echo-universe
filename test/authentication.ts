import 'mocha';
import 'chai/register-should';
import * as mongoose from 'mongoose';

import { User } from '../models/User';
import { request, userA } from './config';

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;

export function create(user): any {
  return request.post('/api/authentication/user/create')
  .send({
    user: {
      type: 'Public',
      firstName: 'a',
      lastName: 'a',
      email: user.email,
      password: user.password
    }
  });
}

export function login(user): any {
  return request.post('/api/authentication/user/login')
  .send({
    email: user.email,
    password: user.password
  });
}

describe('Authentication', () => {
  before(async () => {
    await User.remove({});
  });
  describe('/user/create', () => {
    it('it should create a user', (done) => {
      create(userA)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id');
        res.body.should.have.property('token');
        done();
      });
    });
  });
  describe('/user/login', () => {
    it('it should log in', (done) => {
      login(userA)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id');
        res.body.should.have.property('token');
        done();
      });
    });
  });
});
