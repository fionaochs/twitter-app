require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const Comment = require('../lib/models/Comment');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a new tweet', () => {
    return request(app)
      .post('/api/v1/tweets')
      .send({
        handle: '@testtweet',
        text: 'test tweet'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: '@testtweet',
          text: 'test tweet',
          __v: 0
        });
      });
  });

  it('gets all tweets', async() => {
    const tweets = await Tweet.create([
      { handle: '@testing1', text: 'testing1' },
      { handle: '@testing2', text: 'testing2' },
      { handle: '@testing3', text: 'testing3' }
    ]);
    return request(app)
      .get('/api/v1/tweets')
      .then(res => {
        tweets.forEach((tweet) => {
          expect(res.body).toContainEqual(
            { _id: tweet._id.toString(), handle: tweet.handle, text: tweet.text,  __v: 0 }   
          );
        });
      });
  });

  // it('creates a tweet with random text', () => {
  //   return request(app)
  //     .post('/api/v1/tweets')
  //     .send({
  //       handle: 'test',
  //     })
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: expect.any(String),
  //         handle: 'test',
  //         text: expect.any(String),
  //         __v: 0
  //       });
  //     });
  // });

  // it('gets tweet by id', async() => {
  //   const tweet = await Tweet.create({ 
  //     handle: '@testing1', text: 'testing1' 
  //   });
  //   return request(app)
  //     .get(`/api/v1/tweets/${tweet._id}`)
  //     .then(res => {
  //       expect(res.body).toEqual({
  //         _id: tweet._id.toString(),
  //         handle: tweet.handle, 
  //         text: tweet.text,  
  //         __v: 0
  //       });
  //     });
  // });

  it('gets a tweet by id', async() => {
    const tweet = await Tweet
      .create({
        handle: 'test',
        text: 'test 1234'
      });
    const comments = await Comment.create([{
      tweetId: tweet._id,
      handle: 'commenter',
      text: 'great!'
    }]);

    return request(app)
      .get(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'test',
          text: 'test 1234',
          comments: expect.any(Array),
          __v: 0
        });
        expect(res.body.comments).toEqual(JSON.parse(JSON.stringify(comments)));
      });
  });

  it('updates tweet by id', async() => {
    const tweet = await Tweet.create({ 
      handle: '@testing1', text: 'testing1' 
    });
    return request(app)
      .patch(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: tweet._id.toString(),
          handle: tweet.handle, 
          text: tweet.text,  
          __v: 0
        });
      });
  });

  it('deletes tweet by id', async() => {
    const tweet = await Tweet.create({ 
      handle: '@testing1', text: 'testing1' 
    });
    return request(app)
      .delete(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: tweet._id.toString(),
          handle: tweet.handle, 
          text: tweet.text,  
          __v: 0
        });
      });
  });
});






