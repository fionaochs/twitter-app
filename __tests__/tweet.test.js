require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');

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
});





