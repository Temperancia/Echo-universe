import * as express from 'express';
import { Types } from 'mongoose';

let trusting = express.Router();

const Trust = require('../models/trust');

// owner creates a trust
trusting.post('/trusts/create', (req, res) => {
  let trust = {
    '_id': new Types.ObjectId,
    'name': req.body.name,
    'owner': req.body.owner,
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
