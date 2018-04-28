import { Router } from 'express';
import { Types } from 'mongoose';
import * as jwt from 'jsonwebtoken';
const User = require('../models/user');

function makeToken(id = undefined) {
  const token = jwt.sign({
    id: id
  }, global['secret'], {
    expiresIn: '24h'
  });
  return token;
}

let authentication = Router();

authentication.post('/user/create', (req, res) => {
  const user = req.body.user;
  console.log(user);
  let newUser: any = {};
  newUser._id = new Types.ObjectId;
  newUser.type = user.type;
  if (newUser.type === 'Public') {
    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
  } else if (newUser.type === 'Eminent') {
    newUser.userName = user.userName;
  }
  newUser.email = user.email;
  newUser.password = user.password;
  newUser.reputation = 0;
  newUser.friends = [];
  newUser.friendsRequested = [];
  newUser.friendsRequesting = [];
  User.create(newUser, (err, user) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: 'User already exists'
      });
    }
    return res.json({
      success: true,
      id: user._id,
      token: makeToken(user._id)
    });
  });
});

authentication.get('/user/login', (req, res) => {
  return res.json({
    success: true,
    id: undefined,
    token: makeToken()
  });
});

authentication.post('/user/login', (req, res) => {
  console.log(req.body);
  const email = req.body['email'];
  const password = req.body['password'];
  if (!email || !password) {
    return res.json({
      success: false,
      error: 'Wrong email or password'
    });
  }
  User.findOne(req.body, '_id', (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    if (!user) {
      return res.status(500).json({
        success: false,
        error: 'Wrong email or password'
      });
    }
    return res.json({
      success: true,
      id: user._id,
      token: makeToken(user._id)
    });
  });
});

module.exports = authentication;
