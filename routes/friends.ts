import * as express from 'express';
import { Types } from 'mongoose';
const User = require('../models/user');

let friends = express.Router();

friends.get('/user', (req, res) => {
  let friends = [];
  User.findOne({'_id': req.decoded.id}, 'friends', (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    for (let id of user.friends) {
      User.findOne({'_id': id}, 'type firstName lastName userName', (err, friend) => {
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
  console.log(req.params['id'])
  User.findOneAndUpdate({'_id': req.params['id']},
  {$push: {friendsRequesting: req.decoded.id}}, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    User.findOneAndUpdate({'_id': req.decoded.id},
    {$push: {friendsRequested: req.params['id']}}, (err, user) => {
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

friends.get('/user/accept/:id', (req, res) => {
  User.findOneAndUpdate({'_id': req.decoded.id},
  {$push: {friends: req.params['id']}, $pull: {friendsRequesting: req.params['id']}}, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    return res.json({
      success: true,
    });
  });
});

module.exports = friends;
