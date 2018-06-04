import { Router } from 'express';
import { Types, Promise } from 'mongoose';
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
    for (let trust of trusts) {
      trust.partOf = false;
      if (checkIfMember(trust, id, trust.owner._id)) {
        trust.partOf = true;
      }
    }
    return User.findById(req.decoded.id)
    .select('trustsRequested')
    .then(thisUser => {
      for (let trust of trusts) {
        trust.requested = false;
        if (thisUser.trustsRequested.find(element => { return element.equals(trust._id); })) {
          trust.requested = true;
        }
      }
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
  .populate('owner', 'fullName reputation')
  .populate('moderators', 'fullName reputation')
  .populate('members', 'fullName reputation')
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

function checkIfMember(trust, id, owner=trust.owner): boolean {
  console.log(trust);
  return owner.equals(id)
  || trust.moderators.find(element => { return element.equals(id); })
  || trust.members.find(element => { return element.equals(id); });
}

trusting.get('/trust/:trustId/requesting/send', (req, res) => {
  const thisUserId = req.decoded.id;
  const trustId = req.params.trustId;
  return Trust.findById(trustId)
  .select('owner moderators members')
  .catch(err => {
    return res.status(500).json('Error while finding trust : ' + err);
  })
  .then(trust => {
    if (checkIfMember(trust, thisUserId)) {
      return res.status(500).json('Already member');
    }
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

function removeRequestTo(trustId, owner): void {
  const updateThisUser = {
    $pull: {trustsRequested: trustId}
  };
  User.findByIdAndUpdate(owner, updateThisUser).exec();
}

function removeRequestFrom(trustId, owner, requestor): void {
  const updateThatUser = {
    $pull: {trustsRequesting: {user: requestor, trust: trustId}}
  };
  User.findOneAndUpdate(owner, updateThatUser).exec();
}

trusting.get('/trust/:trustId/requesting/cancel', (req, res) => {
  const thisUserId = req.decoded.id;
  const trustId = req.params.trustId;
  return Trust.findById(trustId)
  .select('owner')
  .then(trust => {
    removeRequestTo(trustId, thisUserId);
    removeRequestFrom(trustId, thisUserId, trust.owner);
    return res.json({});
  })
  .catch(err => {
    return res.status(500).json('Error while finding and updating user : ' + err);
  });
});

trusting.get('/trust/:trustId/requesting/accept/:userId', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.userId;
  const trustId = req.params.trustId;
  return Trust.findById(trustId)
  .select('owner moderators members')
  .then(trust => {
    if (!trust.owner.equals(thisUserId)) {
      return res.status(403).json('Forbidden access');
    }
    if (checkIfMember(trust, thatUserId)) {
      return res.status(500).json('Already member');
    }
    removeRequestFrom(trustId, thisUserId, thatUserId);
    const updateThatUser = {
      $pull: {trustsRequested: trustId},
      $push: {trustsJoined: trustId}
    };
    User.findByIdAndUpdate(thatUserId, updateThatUser).exec();
    const updateTrust = {
      $push: {members: thatUserId}
    };
    Trust.findByIdAndUpdate(trustId, updateTrust).exec();
    return res.json({});
  })
  .catch(err => {
    return res.status(500).json('Error while finding trust : ' + err);
  });
});

trusting.get('/trust/:trustId/requesting/refuse/:userId', (req, res) => {
  const thisUserId = req.decoded.id;
  const trustId = req.params.trustId;
  const thatUserId = req.params.userId;
  removeRequestTo(trustId, thatUserId);
  removeRequestFrom(trustId, thisUserId, thatUserId);
  return res.json({});
});

module.exports = trusting;
