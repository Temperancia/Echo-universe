import { request, userA, userB } from './config';
import { login } from './authentication';

export async function getRequests(user) {
  return await request.get('/api/user/requests')
  .set('x-access-token', user.token);
}

export async function requestFriend(user, friend) {
  return await request.get('/api/friends/user/request/' + friend.id)
  .set('x-access-token', user.token);
}

export async function getFriends(user) {
  return await request.get('/api/user/' + user.id + 'friends')
  .set('x-access-token', userA.token);
}

describe('Requests', () => {
  before(async () => {
    await login(userA);
    await login(userB);
  });
  describe('/user/request/:id', () => {
    it('it should send a friend request', async () => {
      let res;
      res = await requestFriend(userA, userB);
      res.should.have.status(200);

      res = await getRequests(userA);
      res.should.have.status(200);
      res.body.should.include.something.that.deep.equals({
        _id: userB.id,
        fullName: userB.fullName,
        type: 'friendRequestSent'
      });

      res = await getRequests(userB);
      res.should.have.status(200);
      res.body.should.include.something.that.deep.equals({
        _id: userA.id,
        fullName: userA.fullName,
        type: 'friendRequestReceived'
      });
    });
  });
  describe('/user/accept/:id', () => {
    it('it should accept a friend request', async () => {
      let res;
      res = await request.get('/api/friends/user/accept/' + userB.id)
      .set('x-access-token', userA.token);
      res.should.have.status(200);

      res = await getRequests(userA);
      res.should.have.status(200);
      res.body.should.not.include.something.that.deep.equals({
        _id: userB.id,
        fullName: userB.fullName,
        type: 'friendRequestSent'
      });

      res = await getRequests(userB);
      res.should.have.status(200);
      res.body.should.not.include.something.that.deep.equals({
        _id: userA.id,
        fullName: userA.fullName,
        type: 'friendRequestReceived'
      });

      res = await getFriends(userA);
      res.should.have.status(200);
      res.body.should.containEql(userB.id);

    });
  });
});
