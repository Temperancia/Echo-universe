import { Router } from 'express';
import { User } from './../models/user';

let friends = Router();

async function acceptFriend(thisUserId, thatUserId) {
  console.log('accept friend');
  try {
    await User.findByIdAndUpdate(thisUserId, {
      $push: {friends: thatUserId},
      $pull: {friendsRequesting: thatUserId}
    });
    console.log('removing ' + thisUserId + ' from ' + thatUserId);
    await User.findByIdAndUpdate(thatUserId, {
      $push: {friends: thisUserId},
      $pull: {friendsRequested: thisUserId}
    });
    return undefined;
  } catch(err) {
    console.log('Error : ', err.message);
    return err.message;
  }
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
  if (friends.find(request => {
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

async function addFriendRequest(from, to) {
  console.log('adding friend request to that user');
  await User.findByIdAndUpdate(to, {
    $push: {
      friendsRequesting: from
    }
  });
}

async function addFriendRequested(thisUser, to) {
  console.log('adding friend request to this user')
  await User.findByIdAndUpdate(thisUser, {
    $push: {friendsRequested: to}
  });
}

friends.get('/user/request/:id', async (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  console.log(thisUserId + ' asks to be friend with ' + thatUserId);
  if (thisUserId === thatUserId) {
    return res.status(500).json('Cannot ask out yourself');
  }
  try {
    const thatUser = await User.findById(thatUserId, 'friends friendsRequested friendsRequesting')
    checkIfFriends(thisUserId, thatUser.friends);
    if (checkIfAlreadyAsked(thisUserId, thatUser.friendsRequested, thatUserId)) {
      return res.json({});
    }
    checkIfRequestIsPending(thisUserId, thatUser.friendsRequesting);
    addFriendRequest(thisUserId, thatUserId);
    addFriendRequested(thisUserId, thatUserId);
    return res.json({});
  } catch(err) {
    console.error('Error : ', err.message);
    return res.status(500).json(err.message);
  }
});

friends.get('/user/cancel/:id', async (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  try {
    await User.findByIdAndUpdate(thisUserId, {
      $pull: {friendsRequested: thatUserId}
    });
    await User.findByIdAndUpdate(thatUserId, {
      $pull: {friendsRequesting: thisUserId}
    });
    return res.json({});
  } catch(err) {
    return res.status(500).json('Error while finding and updating : ' + err);
  }
});

friends.get('/user/accept/:id', async (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  const message = await acceptFriend(thisUserId, thatUserId);
  if (message) {
    return res.status(500).json(message);
  }
  return res.json({});
});

friends.get('/user/refuse/:id', async (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  try {
    await User.findByIdAndUpdate(thisUserId, {
      $pull: {friendsRequesting: thatUserId}
    });
    await User.findByIdAndUpdate(thatUserId, {
      $pull: {friendsRequested: thisUserId}
    });
    return res.json({});
  } catch(err) {
    return res.status(500).json('Error while finding and updating : ' + err);
  }
});

friends.get('/user/remove/:id', async (req, res) => {
  const thisUserId = req.decoded.id;
  const thatUserId = req.params.id;
  try {
    await User.findByIdAndUpdate(thisUserId, {
      $pull: {friends: thatUserId}
    });
    await User.findByIdAndUpdate(thatUserId, {
      $pull: {friends: thisUserId}
    });
    return res.json({});
  } catch(err) {
    return res.status(500).json('Error while finding and updating : ');
  }
});

module.exports = friends;
