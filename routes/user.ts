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
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    let returnedUser = {
      'type': user.type,
      'firstName': user.firstName,
      'lastName': user.lastName,
      'userName': user.userName,
      'reputation': user.reputation,
      'birth': user.birth
    };
    if (thisUserId in user.friends) {
      returnedUser['friends'] = user.friends;
    }
    return res.json({
      success: true,
      user: returnedUser
    });
  });
});

user.get('/users', (req, res) => {
  User.find({}, 'firstName lastName userName', (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding users : ' + err
      });
    }
    return res.json({
      success: true,
      users: users
    });
  });
});

user.get('/:user/trusts', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  // check if the requiring user is friend with the required user
  User.findById(thatUserId, 'friends trustsOwned trustsJoined', (err, thatUser) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    if (thisUserId !== thatUserId && !(thisUserId in thatUser.friends)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden access'
      });
    }
    return res.json({
      success: true,
      trustsOwned: thatUser.trustsOwned,
      trustsJoined: thatUser.trustsJoined
    });
  })
});

user.get('/requests', (req, res) => {
  User.findById(req.decoded.id, 'trustsRequesting friendsRequesting', (err, thisUser) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    User.find({'_id': {$in: thisUser.friendsRequesting}}, 'firstName lastName userName', (err, friendsRequests) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Error while finding user : ' + err
        });
      }
      return res.json({
        success: true,
        trustsRequesting: thisUser.trustsRequesting,
        friendsRequests: friendsRequests
      });
    });
  });
});

user.get('/:user/friends', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.user;
  // check if the requiring user is friend with the required user
  User.findById(thatUserId, 'friends', (err, thatUser) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    if (thisUserId !== thatUserId && !(thisUserId in thatUser.friends)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden access'
      });
    }
    return res.json({
      success: true,
      friends: thatUser.friends
    });
  })
});

module.exports = user;
