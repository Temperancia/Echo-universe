import * as express from 'express';
import { Types } from 'mongoose';

let trusting = express.Router();

const Trust = require('../models/trust');
const User = require('../models/user');

// owner creates a trust
trusting.post('/trusts/create', (req, res) => {
  console.log('receiving : ' + req.body);
  let data = req.body.trust;
  User.findOne({'_id': req.body['owner']}, (err, owner) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding user : ' + err
      });
    }
    let trust = {
      '_id': new Types.ObjectId,
      'name': data.name,
      'description': data.description,
      'owner': owner,
      'members': [owner],
      'createdOn': Date.now()
    };
    Trust.create(trust, (err, post) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Error while creating trust : ' + err
        });
      }
      return res.json({
        success: true
      });
    });
  });
});

trusting.get('/trusts', (req, res) => {
  Trust.find({}, 'name description owner members reputation', (err, trusts) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding trusts : ' + err
      });
    }
    return res.json({
      success: true,
      trusts: trusts
    });
  });
});

// data from the trust
trusting.get('/trusts/:trust', (req, res) => {
});

// owner changes the trust
trusting.post('/trusts/:trust/update', (req, res) => {
});

// owner deletes the trust
trusting.get('/trusts/:trust/delete', (req, res) => {
});

module.exports = trusting;
