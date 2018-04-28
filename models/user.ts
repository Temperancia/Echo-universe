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
  friends: [Schema.Types.ObjectId],
  friendsRequested: [Schema.Types.ObjectId],
  friendsRequesting: [Schema.Types.ObjectId],
  password: String,
  createdOn: Date,
  updatedOn: {
    type: Date,
    default: Date.now
  },
});
module.exports = mongoose.model('User', userSchema);
