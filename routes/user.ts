import * as express from 'express';
import { Types } from 'mongoose';
const User = require('../models/user');
const Trust = require('../models/trust');

let user = express.Router();

user.get('/:user/profile', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  User.findById(thatUserId, 'type firstName lastName userName reputation birth friends', (err, thatUser) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding user : ' + err
      });
    }
    let returnedUser = {
      'type': thatUser.type,
      'firstName': thatUser.firstName,
      'lastName': thatUser.lastName,
      'userName': thatUser.userName,
      'reputation': thatUser.reputation,
      'birth': thatUser.birth,
      'friends': []
    };
    if (thisUserId in thatUser.friends) {
      returnedUser.friends = thatUser.friends;
    }
    return res.json({
      user: returnedUser
    });
  });
});

user.get('/users', (req, res) => {
  let options = {};
  const name = req.query.name;
  if (name) {
    options = {$or: [
      {'firstName': new RegExp('^' + name, 'i')},
      {'lastName': new RegExp('^' + name, 'i')},
      {'userName': new RegExp('^' + name, 'i')},
    ]};
  }
  User.find(options)
  .select('firstName lastName userName type')
  .where('_id').ne(req.decoded.id)
  .exec((err, users) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding users : ' + err
      });
    }
    return res.json(users);
  });
});

user.get('/:user/trusts', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  // check if the requiring user is friend with the required user
  User.findById(thatUserId, 'friends')
  .populate('trustsOwned', 'name key')
  .populate('trustsJoined', 'name key')
  .exec((err, thatUser) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding user : ' + err
      });
    }
    if (thisUserId !== thatUserId && !(thisUserId in thatUser.friends)) {
      return res.status(403).json({
        error: 'Forbidden access'
      });
    }
    return res.json({
      trustsOwned: thatUser.trustsOwned,
      trustsJoined: thatUser.trustsJoined
    });
  });
});

function addRequests(requests, type, source) {
  for (const request of source) {
    let newRequest = JSON.parse(JSON.stringify(request));
    newRequest.type = type;
    requests.push(newRequest);
  }
  return requests;
}

user.get('/requests', (req, res) => {
  User.findById(req.decoded.id)
  .populate('friendsRequested', 'firstName lastName userName')
  .populate('friendsRequesting', 'firstName lastName userName')
  .populate('trustsRequested', 'name key')
  .populate('trustsRequesting.user', 'firstName lastName userName')
  .populate('trustsRequesting.trust', 'name key')
  .populate('trustInvitationsSent.user', 'firstName lastName userName')
  .populate('trustInvitationsSent.trust', 'name key')
  .populate('trustInvitationsReceived', 'firstName lastName userName')
  .exec((err, thisUser) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding user : ' + err
      });
    }
    let requests = [];
    requests = addRequests(requests, 'friendRequestSent', thisUser.friendsRequested);
    requests = addRequests(requests, 'friendRequestReceived', thisUser.friendsRequesting);
    requests = addRequests(requests, 'trustRequestSent', thisUser.trustsRequested);
    requests = addRequests(requests, 'trustRequestReceived', thisUser.trustsRequesting);
    requests = addRequests(requests, 'trustInvitationSent', thisUser.trustInvitationsSent);
    requests = addRequests(requests, 'trustInvitationReceived', thisUser.trustInvitationsReceived);
    return res.json({
      requests: requests,
    });
  });
});

user.get('/:user/friends', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  // check if the requiring user is friend with the required user
  User.findById(thatUserId, '')
  .populate('friends')
  .exec((err, thatUser) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding user : ' + err
      });
    }
    if (thisUserId !== thatUserId && !(thisUserId in thatUser.friends)) {
      return res.status(403).json({
        error: 'Forbidden access'
      });
    }
    return res.json(thatUser.friends);
  })
});

module.exports = user;
