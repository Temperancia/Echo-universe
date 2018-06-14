import { Router } from 'express';
import { Types } from 'mongoose';
import { User } from '../models/user';
import { Trust } from '../models/trust';

let user = Router();

function findUsers(thisUserId, name = undefined) {
  let options = {};
  if (name) {
    options = {$or: [
      {firstName: new RegExp('^' + name, 'i')},
      {lastName: new RegExp('^' + name, 'i')},
      {userName: new RegExp('^' + name, 'i')},
      {fullName: new RegExp('^' + name, 'i')},
    ]};
  }
  return User.find(options)
  .where('_id').ne(thisUserId)
  .select('fullName type')
  .lean()
  .exec();
}

user.get('/:user/profile', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  return User.findById(thatUserId)
  .select('type fullName reputation birth')
  .populate('friends')
  .then(thatUser => {
    const friendIds = thatUser.friends.map(friend => { return friend._id; });
    if (thisUserId.indexOf(friendIds) === -1) {
      thatUser.friends = [];
    }
    return res.json(thatUser);
  })
  .catch(err => {
    return res.status(500).json('Error while finding user : ' + err);
  });
});

user.get('/users', (req, res) => {
  return findUsers(req.decoded.id, req.query.name)
  .then(users => {
    return res.json(users);
  })
  .catch(err => {
    return res.status(500).json('Error while finding users : ' + err);
  });
});

user.get('/friendable-users', (req, res) => {
  const thisUserId = req.decoded.id;
  return findUsers(thisUserId)
  .then(users => {
    User.findById(thisUserId)
    .select('friends friendsRequested')
    .then(thisUser => {
      const thisUserFriends = thisUser.friends;
      const thisUserFriendsRequested = thisUser.friendsRequested;
      for (let user of users) {
        user.friendWith = (thisUserFriends.indexOf(user._id) > -1);
        user.friendRequested = (thisUserFriendsRequested.indexOf(user._id) > -1);
      }
      return res.json(users);
    })
    .catch(err => {
      return res.status(500).json('Error while finding user : ' + err);
    });
  })
  .catch(err => {
    return res.status(500).json('Error while finding users : ' + err);
  });
});

user.get('/:user/trusts', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  return User.findById(thatUserId)
  .select('friends trustReputation')
  .populate('trustsOwned', 'name key')
  .populate('trustsJoined', 'name key')
  .then(thatUser => {
    if (thisUserId !== thatUserId && thatUser.friends.indexOf(thisUserId) === -1) {
      return res.status(403).json('Forbidden access');
    }
    const trustReputation = thatUser.trustReputation;
    for (let trust of thatUser.trustsJoined) {
      console.log(trust);
      console.log(trustReputation);
      const index = trustReputation.map(rep => rep.trust).indexOf(trust.name);
      console.log(index);
      trust.reputation = trustReputation[index].rank;
    }
    return res.json({
      trustsOwned: thatUser.trustsOwned,
      trustsJoined: thatUser.trustsJoined
    });
  })
  .catch(err => {
    return res.status(500).json('Error while finding user : ' + err);
  });
});

function addRequests(requests, type, source) {
  for (let request of source) {
    request.type = type;
    requests.push(request);
  }
  return requests;
}

user.get('/requests', async (req, res) => {
  try {
    const thisUser = await User.findById(req.decoded.id)
    .populate('friendsRequested', 'fullName')
    .populate('friendsRequesting', 'fullName')
    .populate('trustRequests', 'name key')
    .populate('trustInvitations', 'name key')
    .lean();
    let requests = [];
    requests = addRequests(requests, 'friendRequestSent', thisUser.friendsRequested);
    requests = addRequests(requests, 'friendRequestReceived', thisUser.friendsRequesting);
    requests = addRequests(requests, 'trustRequest', thisUser.trustRequests);
    requests = addRequests(requests, 'trustInvitation', thisUser.trustInvitations);
    return res.json(requests);
  } catch(err) {
    return res.status(500).json('Error while finding user');
  }
});

user.get('/:user/friends', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  // check if the requiring user is friend with the required user
  return User.findById(thatUserId)
  .populate('friends', 'fullName reputation')
  .then(thatUser => {
    if (thisUserId !== thatUserId
      && thatUser.friends.indexOf(thisUserId) === -1) {
      return res.status(403).json('Forbidden access');
    }
    return res.json(thatUser.friends);
  })
  .catch(err => {
    return res.status(500).json('Error while finding friends : ' + err);
  });
});

module.exports = user;
