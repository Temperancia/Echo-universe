import * as express from 'express';
const User = require('../models/user');

let friends = express.Router();

friends.get('/user', (req, res) => {
  let friends = [];
  User.findById(req.decoded.id, 'friends', (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    for (let id of user.friends) {
      User.findById(id, 'type firstName lastName userName', (err, friend) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: 'Error while finding friend : ' + err
          });
        }
        friends.push(friend);
      });
    }
    return res.json({
      success: true,
      friends: friends
    });
  });
});

friends.get('/user/request/:id', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params['id'];
  if (thisUserId === thatUserId) {
    return res.status(500).json({
      success: false,
      error: 'Cannot ask out yourself'
    });
  }
  User.findById(thatUserId, 'friendsRequesting', (err, thatUser) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    if (thisUserId in thatUser.friendsRequesting) {
      return res.status(500).json({
        success: false,
        error: 'Friend request is still pending'
      });
    }
    User.findByIdAndUpdate(thatUserId,
    {$push: {friendsRequesting: thisUserId}}, (err, thatUser) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Error while finding user : ' + err
        });
      }
      User.findByIdAndUpdate(thisUserId,
      {$push: {friendsRequested: thatUserId}}, (err, thisUser) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: 'Error while finding user : ' + err
          });
        }
        return res.json({
          success: true,
        });
      })
    });
  });
});

friends.get('/user/accept/:id', (req, res) => {
  User.findByIdAndUpdate(req.decoded.id,
  {$push: {friends: req.params['id']}, $pull: {friendsRequesting: req.params['id']}}, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding or updating user : ' + err
      });
    }
    return res.json({
      success: true,
    });
  });
});

module.exports = friends;
