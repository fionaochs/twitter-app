const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  tweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
    required: true
  },
  handle: {
    type: String,
    required:true
  },
  text: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Comment', schema);
