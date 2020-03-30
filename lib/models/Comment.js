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

schema.statics.topHandles = function() {
  return this
    .aggregate([
      {
        '$group': {
          '_id': '$handle', 
          'count': {
            '$sum': 1
          }
        }
      }, {
        '$sort': {
          'count': -1
        }
      }
    ]);
};

module.exports = mongoose.model('Comment', schema);
