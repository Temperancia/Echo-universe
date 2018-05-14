import { Router } from 'express';
import { Types } from 'mongoose';
import { User } from '../models/user';
import { Trust } from '../models/trust';

let user = Router();

user.get('/:user/profile', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  return User.findById(thatUserId)
  .select('type firstName lastName userName reputation birth')
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
  let options = {};
  const name = req.query.name;
  if (name) {
    options = {$or: [
      {firstName: new RegExp('^' + name, 'i')},
      {lastName: new RegExp('^' + name, 'i')},
      {userName: new RegExp('^' + name, 'i')},
      {fullName: new RegExp('^' + name, 'i')},
    ]};
  }
  return User.find(options)
  .where('_id').ne(req.decoded.id)
  .select('fullName type')
  .then(users => {
    return res.json(users);
  })
  .catch(err => {
    return res.status(500).json('Error while finding users : ' + err);
  });
});

user.get('/:user/trusts', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  // check if the requiring user is friend with the required user
  return User.findById(thatUserId, 'friends')
  .populate('trustsOwned', 'name key')
  .populate('trustsJoined', 'name key')
  .then(thatUser => {
    if (thisUserId !== thatUserId && thatUser.friends.indexOf(thisUserId) === -1) {
      return res.status(403).json('Forbidden access');
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

user.get('/requests', (req, res) => {
  return User.findById(req.decoded.id)
  .populate('friendsRequested', 'firstName lastName userName')
  .populate('friendsRequesting', 'firstName lastName userName')
  .populate('trustsRequested', 'name key')
  .populate('trustsRequesting.user', 'firstName lastName userName')
  .populate('trustsRequesting.trust', 'name key')
  .populate('trustInvitationsSent.user', 'firstName lastName userName')
  .populate('trustInvitationsSent.trust', 'name key')
  .populate('trustInvitationsReceived', 'firstName lastName userName')
  .lean()
  .then(thisUser => {
    let requests = [];
    requests = addRequests(requests, 'friendRequestSent', thisUser.friendsRequested);
    requests = addRequests(requests, 'friendRequestReceived', thisUser.friendsRequesting);
    requests = addRequests(requests, 'trustRequestSent', thisUser.trustsRequested);
    requests = addRequests(requests, 'trustRequestReceived', thisUser.trustsRequesting);
    requests = addRequests(requests, 'trustInvitationSent', thisUser.trustInvitationsSent);
    requests = addRequests(requests, 'trustInvitationReceived', thisUser.trustInvitationsReceived);
    return res.json(requests);
  })
  .catch(err => {
    return res.status(500).json('Error while finding user : ' + err);
  });
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
