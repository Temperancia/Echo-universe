import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trustSchema = new Schema({
   _id: Schema.Types.ObjectId,
   name: String,
   owner: Schema.Types.ObjectId,
   moderators: [Schema.Types.ObjectId],
   members: [Schema.Types.ObjectId],
   reputation: Number,
   createdOn: Date,
   updatedOn: {
      type: Date,
      default: Date.now
   }
});
module.exports = mongoose.model('Trust', trustSchema);
