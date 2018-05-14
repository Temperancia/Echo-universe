import * as express from 'express';
import { Types, Promise } from 'mongoose';
import { Post } from '../models/post';

let posting = express.Router();

posting.post('/posts/create', (req, res) => {
  const post = req.body.post;
  const newPost = {
    _id: new Types.ObjectId,
    originType: post.originType,
    originName: post.originName,
    content: post.content,
    author: req.decoded.id,
    reputation: 0,
    createdOn: Date.now()
  };
  console.log(newPost);
  return Post.create(newPost)
  .then(_ => {
    return res.json({});
  })
  .catch(err => {
    return res.status(500).json('Error while creating post : ' + err);
  });
});

posting.get('/posts/get', (req, res) => {
  const type = req.query.type;
  const user = req.query.user;
  if (type && type === 'Flux') {
    findPostsFromFluxes(req.query.origin.split(' '))
    .then(posts => {
      return res.json(posts);
    })
    .catch(err => {
      return res.status(500).json('Error while finding posts : ' + err);
    });
  } else if (user) {
    findPostsFromUser(user)
    .then(posts => {
      return res.json(posts);
    })
    .catch(err => {
      return res.status(500).json('Error while finding posts : ' + err);
    })
  }
});

function findPostsFromFluxes(fluxes: string): Promise {
  const filter = {
    originType: 'Flux',
    originName: {$in: fluxes}
  }
  return Post.find(filter)
  .select('originName content createdOn reputation')
  .populate('author', 'fullName reputation')
  .exec();
}

function findPostsFromUser(user: string): Promise {
  return Post.find({author: user})
  .select('content createdOn reputation')
  .exec();
}

module.exports = posting;
