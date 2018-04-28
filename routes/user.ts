import * as express from 'express';
import { Types } from 'mongoose';
const User = require('../models/user');

let user = express.Router();

user.get('/profile', (req, res) => {
  console.log(req.decoded);
  User.findOne({'_id': req.decoded.id}, 'type firstName lastName email reputation birth', (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    return res.json({
      success: true,
      user: user
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

module.exports = user;
