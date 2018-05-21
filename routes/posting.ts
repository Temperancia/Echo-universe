import { Router } from 'express';
import { Types, Promise } from 'mongoose';
import { Post } from '../models/post';

let posting = Router();

posting.post('/posts/create', (req, res) => {
  const post = req.body.post;
  const newPost = {
    _id: new Types.ObjectId,
    originType: post.originType,
    originName: post.originName,
    postType: post.postType,
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
  if (type) {
    if (type === 'Flux') {
      findPostsFromFluxes(req.query.origin.split(' '))
      .then(posts => {
        return res.json(posts);
      })
      .catch(err => {
        return res.status(500).json('Error while finding posts : ' + err);
      });
    } else if (type === 'Trust') {
      console.log('ok');
      findPostsFromTrust(req.query.origin)
      .then(posts => {
        return res.json(posts);
      })
      .catch(err => {
        return res.status(500).json('Error while finding posts : ' + err);
      });
    }
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
  };
  return Post.find(filter)
  .select('originName postType content createdOn reputation')
  .populate('author', 'fullName reputation')
  .exec();
}

function findPostsFromUser(user: string): Promise {
  return Post.find({author: user})
  .select('postType content createdOn reputation')
  .exec();
}

function findPostsFromTrust(trustKey: string): Promise {
  const filter = {
    originType: 'Trust',
    originName: trustKey
  };
  console.log(filter);
  return Post.find(filter)
  .select('postType content createdOn reputation')
  .populate('author', 'fullName reputation')
  .exec();
}

module.exports = posting;
