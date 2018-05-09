import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trustSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    unique: true
  },
  key: {
    type: String,
    unique: true
  },
  description: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  policies: [String],
  reputation: Number,
  createdOn: Date,
  updatedOn: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Trust', trustSchema);
