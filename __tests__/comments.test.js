require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const Comment = require('../lib/models/Comment');

describe('comment routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a comment', () => {
    return request(app)
      .post('/api/v1/comments')
      .send({
        tweetId: new mongoose.Types.ObjectId(),
        handle: 'test',
        text: 'test 1234'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: expect.any(String),
          handle: 'test',
          text: 'test 1234',
          __v: 0
        });
      });
  });

  it('gets a comment by id', async() => {
    const tweet = await Tweet.create({
      handle: 'test',
      text: 'test 1234'
    });

    const comment = await Comment
      .create({
        tweetId: tweet._id,
        handle: 'commenter',
        text: 'great!'
      });

    return request(app)
      .get(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: {
            ...tweet.toJSON(),
            _id: tweet.id
          },
          handle: 'commenter',
          text: 'great!',
          __v: 0
        });
      });
  });

  it('updates a comment by id', async() => {
    const tweet = await Tweet.create({
      handle: 'test',
      text: 'test 1234'
    });

    const comment = await Comment
      .create({
        tweetId: tweet._id,
        handle: 'commenter',
        text: 'great!'
      });

    return request(app)
      .patch(`/api/v1/comments/${comment._id}`)
      .send({ text: 'bad!' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: tweet.id,
          handle: 'commenter',
          text: 'bad!',
          __v: 0
        });
      });
  });

  it('deletes a comment by id', async() => {
    const tweet = await Tweet.create({
      handle: 'test',
      text: 'test 1234'
    });

    const comment = await Comment
      .create({
        tweetId: tweet._id,
        handle: 'commenter',
        text: 'great!'
      });

    return request(app)
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: tweet.id,
          handle: 'commenter',
          text: 'great!',
          __v: 0
        });
      });
  });

});
