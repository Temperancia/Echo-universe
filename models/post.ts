import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
   _id: Schema.Types.ObjectId,
   title: String,
   content: String,
   author: Schema.Types.ObjectId,
   reputation: Number,
   reports: Number,
   createdOn: Date,
   updatedOn: {
      type: Date,
      default: Date.now
   }
});
module.exports = mongoose.model('Post', postSchema);
