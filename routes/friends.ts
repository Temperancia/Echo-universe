import * as express from 'express';
const User = require('../models/user');

let friends = express.Router();

function acceptFriend(thisUserId, thatUserId): string {
  console.log('accept friend');
  return User.findByIdAndUpdate(thisUserId,
  {$push: {friends: thatUserId}, $pull: {friendsRequesting: thatUserId}})
  .exec()
  .then(
    User.findByIdAndUpdate(thatUserId,
    {$push: {friends: thisUserId}, $pull: {friendsRequested: thisUserId}})
    .exec()
  )
  .catch(err => {
    console.error('Error : ', err.message);
    return err.message;
  })
  .then(() => {
    return undefined;
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

function checkIfRequestIsPending(thisUserId, friendsRequesting) {
  console.log('checking if request is still pending');
  if (friendsRequesting.find((request) => {
    return request == thisUserId;
  })) {
    throw new Error('Friend request is still pending');
  }
}

function addFriendRequest(from, to) {
  console.log('adding friend request to that user');
  User.findByIdAndUpdate(to,
  {$push: {friendsRequesting: from}}).exec();
}

function addFriendRequested(thisUser, to) {
  console.log('adding friend request to this user')
  User.findByIdAndUpdate(thisUser,
  {$push: {friendsRequested: to}}).exec();
}

friends.get('/user/request/:id', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  if (thisUserId === thatUserId) {
    return res.status(500).json({
      error: 'Cannot ask out yourself'
    });
  }
  return User.findById(thatUserId, 'friendsRequested friendsRequesting')
  .then(thatUser => {
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
    return res.status(500).json({
      error: err.message
    });
  })
});

friends.get('/user/accept/:id', (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  const message = acceptFriend(thisUserId, thatUserId);
  if (message) {
    return res.status(500).json({
      error: message
    });
  }
  return res.json({});
});

module.exports = friends;
