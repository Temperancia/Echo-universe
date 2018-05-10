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
        error: 'Error while creating trust : ' + err
      });
    }
    User.findByIdAndUpdate(thisUserId, {$push: {'trustsOwned': newTrust._id}}, (err, user) => {
      if (err) {
        return res.status(500).json({
          error: 'Error while updating user : ' + err
        });
      }
      return res.end();
    });
  });
});

trusting.get('/trusts/get', (req, res) => {
  Trust.find({}, 'name key description owner members reputation')
  .populate('owner', 'firstName lastName')
  .exec((err, trusts) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding trusts : ' + err
      });
    }
    return res.json(trusts);
  });
});

// data from the trust
trusting.get('/trust/:key/get', (req, res) => {
  Trust.findOne({key: req.params.key}, 'name reputation')
  .populate('owner', 'firstName lastName')
  .populate('moderators', 'firstName lastName')
  .populate('members', 'firstName lastName')
  .exec((err, trust) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding trust : ' + err
      });
    }
    return res.json({
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
        error: 'Error while deleting trust : ' + err
      });
    }
    return res.end();
  });
});

trusting.get('/trust/:id/requesting/send', (req, res) => {
  const thisUserId = req.decoded.id;
  const trustId = req.params.id;
  // look if already member here ?
  Trust.findById(trustId, 'owner', (err, trust) => {
    if (err) {
      return res.status(500).json({
        error: 'Error while finding trust : ' + err
      });
    }
    User.findByIdAndUpdate(trust.owner,
      {$push: {trustsRequesting: {user: thisUserId, trust: trustId}}},
      (err, thatUser) => {
      if (err) {
        return res.status(500).json({
          error: 'Error while finding and updating user : ' + err
        });
      }
      User.findByIdAndUpdate(thisUserId,
        {$push: {trustsRequested: trustId}},
        (err, thisUser) => {
        if (err) {
          return res.status(500).json({
            error: 'Error while finding and updating user : ' + err
          });
        }
        return res.end();
      });
    });
  });
});

module.exports = trusting;
