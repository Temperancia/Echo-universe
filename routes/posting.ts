import * as express from 'express';
import { Types } from 'mongoose';

let posting = express.Router();

const Post = require('../models/post');

posting.post('/posts/create', (req, res) => {
  let post = {
    '_id': new Types.ObjectId,
    'title': req.body.title,
    'content': req.body.content,
    'author': req.decoded.id,
    'createdOn': Date.now()
  };
  Post.create(post, (err, post) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error while creating post : ' + err
      });
    }
    return res.json({
      success: true
    });
  });
});

// get posts from the user
posting.get('/posts/user/:id', (req, res) => {
  console.log(req.decoded.id);
  res.json({
    success: true
  });
});

module.exports = posting;
