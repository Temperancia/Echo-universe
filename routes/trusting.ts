import { Router } from 'express';
import { Types } from 'mongoose';
import { Trust } from '../models/trust';
import { User } from '../models/user';

let trusting = Router();

// owner creates a trust
trusting.post('/trusts/create', (req, res) => {
  console.log('BODY', req.body);
  const data = req.body.trust;
  const thisUserId = req.decoded.id;
  const newTrust = {
    _id: new Types.ObjectId,
    name: data.name,
    key: encodeURIComponent(data.name),
    description: data.description,
    owner: thisUserId,
    moderators: [],
    members: [],
    policies: [],
    reputation: 0,
    createdOn: Date.now()
  };
  return Trust.create(newTrust)
  .then(trust => {
    const update = {
       $push: {trustsOwned: newTrust._id}
    };
    User.findByIdAndUpdate(thisUserId, update).exec();
    return res.json(trust);
  })
  .catch(err => {
    return res.status(500).json( 'Error while creating trust : ' + err);
  });
});

trusting.get('/trusts/get', (req, res) => {
  return Trust.find()
  .select('name key description owner moderators members reputation')
  .populate('owner', 'fullName reputation')
  .lean()
  .then(trusts => {
    const id = Types.ObjectId(req.decoded.id);
    trusts.forEach((trust, index) => {
      trusts[index].partOf = false;
      if (trust.owner._id.equals(id)
      || trust.moderators.find(element => { return element.equals(id); })
      || trust.members.find(element => { return element.equals(id); })) {
        trusts[index].partOf = true;
      }
    });
    return User.findById(req.decoded.id)
    .select('trustsRequested')
    .then(thisUser => {
      trusts.forEach((trust, index) => {
        trusts[index].requested = false;
        if (thisUser.trustsRequested.find(element => { return element.equals(trust._id); })) {
          trusts[index].requested = true;
        }
      });
      return res.json(trusts);
    })
    .catch(err => {
      return res.status(500).json('Error while finding user : ' + err);
    });
  })
  .catch(err => {
    return res.status(500).json('Error while finding trusts : ' + err);
  });
});

// data from the trust
trusting.get('/trust/:key/get', (req, res) => {
  return Trust.findOne({key: req.params.key})
  .select('name reputation')
  .populate('owner', 'firstName lastName')
  .populate('moderators', 'firstName lastName')
  .populate('members', 'firstName lastName')
  .then(trust => {
    return res.json(trust);
  })
  .catch(err => {
    return res.status(500).json('Error while finding trust : ' + err);
  });
});

// owner changes the trust
trusting.put('/trust/:trust/update', (req, res) => {
});

// owner deletes the trust
trusting.delete('/trust/:trust/delete', (req, res) => {
  return Trust.findOneAndRemove({name: req.params.trust}, (err, trust) => {
    if (err) {
      return res.status(500).json('Error while deleting trust : ' + err);
    }
    return res.json({});
  });
});

trusting.get('/trust/:trustId/requesting/send', (req, res) => {
  const thisUserId = req.decoded.id;
  const trustId = req.params.trustId;
  return Trust.findById(trustId)
  .select('owner')
  .catch(err => {
    return res.status(500).json('Error while finding trust : ' + err);
  })
  .then(trust => {
    const updateThatUser = {
      $push: {trustsRequesting: {user: thisUserId, trust: trustId}}
    };
    User.findByIdAndUpdate(trust.owner, updateThatUser).exec();
    const updateThisUser = {
      $push: {trustsRequested: trustId}
    };
    User.findByIdAndUpdate(thisUserId, updateThisUser).exec();
    return res.json({});
  })
  .catch(err => {
    return res.status(500).json('Error while finding and updating user : ' + err);
  });
});

trusting.get('/trust/:trustId/requesting/cancel', (req, res) => {
  const thisUserId = req.decoded.id;
  const trustId = req.params.trustId;
  return Trust.findById(trustId)
  .select('owner')
  .catch(err => {
    return res.status(500).json('Error while finding trust : ' + err);
  })
  .then(trust => {
    const updateThatUser = {
      $pull: {trustsRequesting: {user: thisUserId, trust: trustId}}
    };
    User.findByIdAndUpdate(trust.owner, updateThatUser).exec();
    const updateThisUser = {
      $pull: {trustsRequested: trustId}
    };
    User.findByIdAndUpdate(thisUserId, updateThisUser).exec();
    return res.json({});
  })
  .catch(err => {
    return res.status(500).json('Error while finding and updating user : ' + err);
  });
});

module.exports = trusting;
