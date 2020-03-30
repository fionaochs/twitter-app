const mongoose = require('mongoose');
const getQuote = require('../services/quote');

const schema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      // delete ret.__v;
    }
  }
});

schema.pre('validate', function(next) {
  if(this.text) return next();

  getQuote()
    .then(quote => this.text = quote)
    .then(() => next());
});

schema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tweetId'
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

schema.statics.mostCommented = function(count = 10) {
  return this
    .aggregate([
      {
        '$lookup': {
          'from': 'comments', 
          'localField': '_id', 
          'foreignField': 'tweetId', 
          'as': 'comments'
        }
      }, {
        '$project': {
          '_id': true, 
          'handle': true, 
          'text': true, 
          'totalComments': {
            '$size': '$comments'
          }
        }
      }, {
        '$sort': {
          'totalComments': -1
        }
      }, {
        '$limit': count
      }
    ]);
};

module.exports = mongoose.model('Tweet', schema);
