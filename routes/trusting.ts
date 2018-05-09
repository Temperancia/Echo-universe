import { Router } from 'express';
import { Types } from 'mongoose';

let trusting = Router();

const Trust = require('../models/trust');
const User = require('../models/user');

// owner creates a trust
trusting.post('/trusts/create', (req, res) => {
  console.log('BODY', req.body);
  const data = req.body.trust;
  const thisUserId = req.decoded.id;
  const newTrust = {
    '_id': new Types.ObjectId,
    'name': data.name,
    'key': encodeURIComponent(data.name),
    'description': data.description,
    'owner': thisUserId,
    'moderators': [],
    'members': [],
    'policies': [],
    'reputation': 0,
    'createdOn': Date.now()
  };
  Trust.create(newTrust, (err, trust) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while creating trust : ' + err
      });
    }
    User.findByIdAndUpdate(thisUserId, {$push: {'trustsOwned': newTrust._id}}, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: 'Error while updating user : ' + err
        });
      }
      return res.json({
        success: true
      });
    });
  });
});

trusting.get('/trusts/get', (req, res) => {
  console.log('get trusts');
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
trusting.get('/trust/:trust/get', (req, res) => {
  Trust.findOne({key: req.params.trust}, 'name reputation')
  .populate('owner', 'firstName lastName')
  .populate('moderators', 'firstName lastName')
  .populate('members', 'firstName lastName')
  .exec((err, trust) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while finding trust : ' + err
      });
    }
    return res.json({
      success: true,
      trust: trust
    });
  });
});

// owner changes the trust
trusting.put('/trust/:trust/update', (req, res) => {
});

// owner deletes the trust
trusting.delete('/trust/:trust/delete', (req, res) => {
  Trust.findOneAndRemove({name: req.params.trust}, (err, trust) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while deleting trust : ' + err
      });
    }
    return res.json({
      success: true,
    });
  });
});

trusting.get('/trust/:trust/join', (req, res) => {

});

module.exports = trusting;
