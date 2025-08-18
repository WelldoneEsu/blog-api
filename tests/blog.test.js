// tests/blog.test.js
const request = require('supertest');
const app = require('../app'); // adjust path to your Express app
const mongoose = require('mongoose');
const Post = require('../models/Post');

describe('Blog API', () => {
  beforeAll(async () => {
    // Connect to test DB
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Post.deleteMany();
  });

  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({
        title: 'My First Post',
        content: 'This is the content of my first post.',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('My First Post');
  });

  it('should fetch all posts', async () => {
    await Post.create({ title: 'Test Post', content: 'Test content' });

    const res = await request(app).get('/api/posts');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it('should get a single post by ID', async () => {
    const post = await Post.create({ title: 'Single Post', content: 'Content' });

    const res = await request(app).get(`/api/posts/${post._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Single Post');
  });

  it('should update a post', async () => {
    const post = await Post.create({ title: 'Old Title', content: 'Old Content' });

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .send({ title: 'Updated Title', content: 'Updated Content' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should delete a post', async () => {
    const post = await Post.create({ title: 'Delete Me', content: 'Content' });

    const res = await request(app).delete(`/api/posts/${post._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
