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
  password: String,
  reputation: Number,
  birth: Date,
  createdOn: Date,
  updatedOn: {
    type: Date,
    default: Date.now
  },
  friends: [Schema.Types.ObjectId],
});
module.exports = mongoose.model('User', userSchema);
