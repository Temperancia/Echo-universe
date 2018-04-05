import { Router } from 'express';
import { Types } from 'mongoose';
import * as jwt from 'jsonwebtoken';
const User = require('../models/user');

let authentication = Router();

authentication.post('/user/create', (req, res) => {
  req.body._id = new Types.ObjectId;
  User.create(req.body, (err, user) => {
    if (err) {
      res.status(500).json({
        success: false,
        error: 'User already exists'
      });
    } else {
      res.json({
        success: true
      });
    }
  });
});

authentication.post('/user/login', (req, res) => {
  console.log(req.body);
  const email = req.body['email'];
  const password = req.body['password'];
  if (email === '' || password === '') {
    return res.json({
      success: false,
      error: 'Wrong email or password'
    });
  }
  User.findOne(req.body, '_id', (err, user) => {
    if (err) {

    }
    if (!user) {
      return res.status(500).json({
        success: false,
        error: 'Wrong email or password'
      });
    } else {
      const token = jwt.sign({
        id: user._id
      }, global['secret'], {
        expiresIn: '24h'
      });
      return res.json({
        success: true,
        token: token
      });
    }
  });
});

module.exports = authentication;
