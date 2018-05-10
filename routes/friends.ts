import * as express from 'express';
const User = require('../models/user');

let friends = express.Router();

friends.get('/user', (req, res) => {
  let friends = [];
  User.findById(req.decoded.id, 'friends', (err, user) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding user : ' + err
      });
    }
    for (let id of user.friends) {
      User.findById(id, 'type firstName lastName userName', (err, friend) => {
        if (err) {
          return res.status(500).json({
            error: 'Error while finding friend : ' + err
          });
        }
        friends.push(friend);
      });
    }
    return res.json({
      friends: friends
    });
  });
});

friends.get('/user/request/:id', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  if (thisUserId === thatUserId) {
    return res.status(500).json({
      error: 'Cannot ask out yourself'
    });
  }
  User.findById(thatUserId, 'friendsRequesting', (err, thatUser) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding user : ' + err
      });
    }
    if (thatUser.friendsRequesting.find((request) => {
      return request == thisUserId;
    })) {
      return res.status(500).json({
        error: 'Friend request is still pending'
      });
    }
    User.findByIdAndUpdate(thatUserId,
    {$push: {friendsRequesting: thisUserId}}, (err, thatUser) => {
      if (err) {
        return res.status(500).json({
          error: 'Error while finding user : ' + err
        });
      }
      User.findByIdAndUpdate(thisUserId,
      {$push: {friendsRequested: thatUserId}}, (err, thisUser) => {
        if (err) {
          return res.status(500).json({
            error: 'Error while finding user : ' + err
          });
        }
        return res.json({});
      })
    });
  });
});

friends.get('/user/accept/:id', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params['id'];
  User.findByIdAndUpdate(thisUserId,
  {$push: {friends: thatUserId}, $pull: {friendsRequesting: thatUserId}}, (err, thisUser) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding or updating user : ' + err
      });
    }
    User.findByIdAndUpdate(thatUserId,
    {$push: {friends: thisUserId}, $pull: {friendsRequested: thisUserId}}, (err, thatUser) => {
      if (err) {
        return res.status(500).json({
          error: 'Error while finding or updating user : ' + err
        });
      }
      return res.json({});
    });
  });
});

module.exports = friends;
