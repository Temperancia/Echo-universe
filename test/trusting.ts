import { login, create } from './authentication';
import { request, userA, userB, trustA } from './config';
import * as mongoose from 'mongoose';
import { Trust } from '../models/Trust';

mongoose.connect('mongodb://localhost/test');
const db = mongoose.connection;

export function createTrust(owner, trust): any {
  return request.post('/api/trusting/trusts/create')
  .set('x-access-token', owner.token)
  .send({
    trust: {
      name: trust.name,
      description: trust.description
    }
  });
}

describe('Trusting : API tests', () => {
  let user;
  before(async () => {
    await Trust.remove({});
    const resA = await login(userA);
    userA.id = resA.body.id;
    userA.token = resA.body.token;
    const resB = await create(userB);
    userB.id = resB.body.id;
    userB.token = resB.body.token;
  });
  describe('/trusts/create', () => {
    it('it should create a trust', (done) => {
      createTrust(userA, trustA)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('_id');
        res.body.should.have.property('name').eql(trustA.name);
        res.body.should.have.property('key').eql(trustA.key);
        res.body.should.have.property('description').eql(trustA.description);
        res.body.should.have.property('owner').eql(userA.id);
        res.body.should.have.property('moderators').eql([]);
        res.body.should.have.property('members').eql([]);
        res.body.should.have.property('policies').eql([]);
        res.body.should.have.property('reputation').eql(0);
        res.body.should.have.property('createdOn');
        trustA.id = res.body._id;
        done();
      });
    });
  });
  describe('/trusts/get', () => {
    it('it should get all the trusts', (done) => {
      request.get('/api/trusting/trusts/get')
      .set('x-access-token', userA.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
    });
  });
  describe('/trust/:key/get', () => {
    it('it should get the trust data', (done) => {
      const url = '/api/trusting/trust/' + encodeURIComponent(trustA.key) + '/get';
      request.get(url)
      .set('x-access-token', userA.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('name').eql(trustA.name);
        res.body.should.have.property('reputation');
        res.body.should.have.property('owner')
        res.body.owner.should.have.property('fullName').eql(userA.fullName);
        res.body.owner.should.have.property('reputation');
        res.body.should.have.property('moderators');
        res.body.should.have.property('members');
        done();
      });
    });
  });
  describe('/trust/:trustId/requesting/send', () => {
    it('it should send a trust request', async () => {
      let err, res = await request.get('/api/trusting/trust/' + trustA.id + '/requesting/send')
      .set('x-access-token', userB.token);
      res.should.have.status(200);
      request.get('/api/user/requests')
      .set('x-access-token', userB.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.should.include.something.that.deep.equals({
          _id: trustA.id,
          name: trustA.name,
          key: trustA.key,
          type: 'trustRequestSent'
        });
      });
    });
  });
});
