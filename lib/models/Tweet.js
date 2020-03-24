const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 280
  }
});

// schema.virtual('comments', {
//   ref: 'Comment',
//   localField: '_id',
//   foreignField: 'Tweet'
// });

module.exports = mongoose.model('Tweet', schema);
