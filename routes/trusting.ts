import { Router } from 'express';
import { Types } from 'mongoose';
import { Trust } from '../models/trust';
import { User } from '../models/user';

let trusting = Router();

// owner creates a trust
trusting.post('/trusts/create', async (req, res) => {
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
  try {
    const trust = await Trust.create(newTrust);
    const update = {
       $push: {trustsOwned: newTrust._id}
    };
    await User.findByIdAndUpdate(thisUserId, update);
    return res.json(trust);
  } catch(err) {
    console.log(err);
    return res.status(500).json('Error while creating trust : ' + err);
  }
});

trusting.get('/trusts/get', async (req, res) => {
  try {
    const trusts = await Trust.find()
    .select('name key description owner moderators members reputation')
    .populate('owner', 'fullName reputation')
    .lean();
    const thisUser = await User.findById(req.decoded.id)
    .select('trustsRequested');
    const trustsRequested = thisUser.trustsRequested;
    const id = Types.ObjectId(req.decoded.id);
    for (let trust of trusts) {
      trust.partOf = false;
      if (checkIfMember(trust, id, trust.owner._id)) {
        trust.partOf = true;
      }
      trust.requested = false;
      if (trustsRequested.find(element => {
        return element.equals(trust._id);
      })) {
        trust.requested = true;
      }
    }
    return res.json(trusts);
  } catch(err) {
    return res.status(500).json('Error while finding trusts : ' + err);
  }
});

// data from the trust
trusting.get('/trust/:key/get', async (req, res) => {
  try {
    const trust = await Trust.findOne({key: req.params.key})
    .select('name reputation')
    .populate('owner', 'fullName reputation')
    .populate('moderators', 'fullName reputation')
    .populate('members', 'fullName reputation');
    return res.json(trust);
  } catch(err) {
    return res.status(500).json('Error while finding trust : ' + err);
  }
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
  return owner.equals(id)
  || trust.moderators.find(element => { return element.equals(id); })
  || trust.members.find(element => { return element.equals(id); });
}

trusting.get('/trust/:trustId/requesting/send', async (req, res) => {
  const thisUserId = req.decoded.id;
  const trustId = req.params.trustId;
  try {
    const trust = await Trust.findById(trustId)
    .select('owner moderators members');
    if (checkIfMember(trust, thisUserId)) {
      return res.status(500).json('Already member');
    }
    const updateThatUser = {
      $push: {trustsRequesting: {
        user: thisUserId,
        trust: trustId
      }}
    };
    await User.findByIdAndUpdate(trust.owner, updateThatUser);
    console.log('updated');
    const updateThisUser = {
      $push: {trustsRequested: trustId}
    };
    User.findByIdAndUpdate(thisUserId, updateThisUser).exec();
    return res.json({});
  } catch(err) {
    return res.status(500).json('Error while finding and updating user : ' + err);
  }
});

async function removeRequestTo(trustId, owner): Promise<void> {
  const updateThisUser = {
    $pull: {trustsRequested: trustId}
  };
  await User.findByIdAndUpdate(owner, updateThisUser);
}

async function removeRequestFrom(trustId, owner, requestor): Promise<void> {
  const updateThatUser = {
    $pull: {trustsRequesting: {user: requestor, trust: trustId}}
  };
  await User.findOneAndUpdate(owner, updateThatUser);
}

trusting.get('/trust/:trustId/requesting/cancel', async (req, res) => {
  const thisUserId = req.decoded.id;
  const trustId = req.params.trustId;
  try {
    const trust = await Trust.findById(trustId)
    .select('owner');
    removeRequestTo(trustId, thisUserId);
    removeRequestFrom(trustId, thisUserId, trust.owner);
    return res.json({});
  } catch(err) {
    return res.status(500).json('Error while finding and updating user : ' + err);
  };
});

trusting.get('/trust/:trustId/requesting/accept/:userId', async (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.userId;
  const trustId = req.params.trustId;
  try {
    const trust = await Trust.findById(trustId)
    .select('name owner moderators members');
    if (!trust.owner.equals(thisUserId)) {
      return res.status(403).json('Forbidden access');
    }
    if (checkIfMember(trust, thatUserId)) {
      return res.status(500).json('Already member');
    }
    removeRequestFrom(trustId, thisUserId, thatUserId);
    const updateThatUser = {
      $pull: {trustsRequested: trustId},
      $push: {
        trustsJoined: trustId,
        trustReputation: {
          trust: trust.name,
          refresh: false,
          score: 0,
          rank: 0
        }
      }
    };
    await User.findByIdAndUpdate(thatUserId, updateThatUser);
    const updateTrust = {
      $push: {members: thatUserId}
    };
    await Trust.findByIdAndUpdate(trustId, updateTrust);
    return res.json({});
  } catch(err) {
    return res.status(500).json('Error while finding trust : ' + err);
  }
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
