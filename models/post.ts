import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  _id: Schema.Types.ObjectId,
  originType: {
    type: String,
    enum: ['Trust', 'Flux'],
  },
  originName: String,
  title: String,
  content: String,
  author: {
     type: Schema.Types.ObjectId,
     ref: 'User'
  },
  reputation: Number,
  reports: Number,
  createdOn: Date,
  updatedOn: {
    type: Date,
    default: Date.now
   }
});
export const Post = mongoose.model('Post', postSchema);
