import * as express from 'express';
import { User } from '../models/user';
import { Promise } from 'mongoose';

let friends = express.Router();

function acceptFriend(thisUserId, thatUserId): Promise {
  console.log('accept friend');
  return User.findByIdAndUpdate(thisUserId,
  {$push: {friends: thatUserId}, $pull: {friendsRequesting: thatUserId}})
  .then(_ => {
    User.findByIdAndUpdate(thatUserId,
    {$push: {friends: thisUserId}, $pull: {friendsRequested: thisUserId}})
    .then(_ => {
      return undefined;
    });
  })
  .catch(err => {
    console.error('Error : ', err.message);
    return err.message;
  });
}

function checkIfAlreadyAsked(thisUserId, friendsRequested, thatUserId): boolean {
  console.log('checking if already asked');
  if (friendsRequested.find((request) => {
    return request == thisUserId;
  })) {
    acceptFriend(thisUserId, thatUserId);
    return true;
  }
  return false;
}

function checkIfFriends(thisUserId, friends) {
  console.log('checking if friends');
  if (friends.find((request) => {
    return request.equals(thisUserId);
  })) {
    throw new Error('Already friends');
  }
}

function checkIfRequestIsPending(thisUserId, friendsRequesting) {
  console.log('checking if request is still pending');
  if (friendsRequesting.find((request) => {
    return request.equals(thisUserId);
  })) {
    throw new Error('Friend request is still pending');
  }
}

function addFriendRequest(from, to): Promise {
  console.log('adding friend request to that user');
  User.findByIdAndUpdate(to,
  {$push: {friendsRequesting: from}}).exec();
}

function addFriendRequested(thisUser, to): Promise {
  console.log('adding friend request to this user')
  const updateThisUser = {
    $push: {friendsRequested: to}
  };
  User.findByIdAndUpdate(thisUser, updateThisUser).exec();
}

friends.get('/user/request/:id', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  if (thisUserId === thatUserId) {
    return res.status(500).json('Cannot ask out yourself');
  }
  return User.findById(thatUserId, 'friends friendsRequested friendsRequesting')
  .then(thatUser => {
    checkIfFriends(thisUserId, thatUser.friends);
    if (checkIfAlreadyAsked(thisUserId, thatUser.friendsRequested, thatUserId)) {
      return res.json({});
    }
    checkIfRequestIsPending(thisUserId, thatUser.friendsRequesting);
    addFriendRequest(thisUserId, thatUserId);
    addFriendRequested(thisUserId, thatUserId);
    return res.json({});
  })
  .catch(err => {
    console.error('Error : ', err.message);
    return res.status(500).json(err.message);
  })
});

friends.get('/user/cancel/:id', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  const updateThisUser = {
    $pull: {friendsRequested: thatUserId}
  };
  return User.findByIdAndUpdate(thisUserId, updateThisUser)
  .then(_ => {
    const updateThatUser = {
      $pull: {friendsRequesting: thisUserId}
    };
    return User.findByIdAndUpdate(thatUserId, updateThatUser).exec();
  })
  .then (_ => {
    return res.json({});
  })
  .catch(err => {
    return res.status(500).json('Error while finding and updating : ' + err);
  });
});

friends.get('/user/accept/:id', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  acceptFriend(thisUserId, thatUserId)
  .then(message => {
    if (message) {
      return res.status(500).json(message);
    }
    return res.json({});
  })
});

friends.get('/user/refuse/:id', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  const updateThisUser = {
    $pull: {friendsRequesting: thatUserId}
  };
  return User.findByIdAndUpdate(thisUserId, updateThisUser)
  .then(_ => {
    const updateThatUser = {
      $pull: {friendsRequested: thisUserId}
    };
    return User.findByIdAndUpdate(thatUserId, updateThatUser).exec();
  })
  .then (_ => {
    return res.json({});
  })
  .catch(err => {
    return res.status(500).json('Error while finding and updating : ' + err);
  });
});

module.exports = friends;
