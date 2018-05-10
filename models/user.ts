import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ['Moderator', 'Public', 'Eminent'],
  },
  firstName: String,
  lastName: String,
  userName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  reputation: Number,
  birth: Date,
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  trustsOwned: [{
    type: Schema.Types.ObjectId,
    ref: 'Trust'
  }],
  trustsJoined: [{
    type: Schema.Types.ObjectId,
    ref: 'Trust'
  }],
  friendsRequested: [Schema.Types.ObjectId],
  friendsRequesting: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  trustsRequested: [{
    type: Schema.Types.ObjectId,
    ref: 'Trust'
  }],
  trustsRequesting: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    trust: {
      type: Schema.Types.ObjectId,
      ref: 'Trust'
    }
  }],
  trustInvitationsSent: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    trust: {
      type: Schema.Types.ObjectId,
      ref: 'Trust'
    }
  }],
  trustInvitationsReceived: [{
    type: Schema.Types.ObjectId,
    ref: 'Trust'
  }],
  password: String,
  createdOn: Date,
  updatedOn: {
    type: Date,
    default: Date.now
  },
});
module.exports = mongoose.model('User', userSchema);
