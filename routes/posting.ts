import { Router } from 'express';
import { Types, Promise } from 'mongoose';
import { Post } from '../models/post';
import { User } from '../models/user';

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
    reputation: {
      upvotes: 0,
      downvotes: 0
    },
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
    });
  }
});

posting.get('/post/:postId/upvote', (req, res) => {
  return vote(req.decoded.id, req.params.postId, 1)
  .then(error => {
    return error ? res.status(500).json(error) : res.json({});
  });
});

posting.get('/post/:postId/downvote', (req, res) => {
  return vote(req.decoded.id, req.params.postId, -1)
  .then(error => {
    return error ? res.status(500).json(error) : res.json({});
  });
});

function vote(voterId: string, postId: string, coefficient: number): Promise {
  return Post.findById(postId)
  .select('originType originName author reputation')
  .then(post => {
    if (post.author.equals(voterId)) {
      return 'Cannot upvote your own post';
    }
    if (post.reputation.voters.find(voter => { return voter.equals(voterId); })) {
      return 'Cannot upvote anymore';
    }
    let updateThisPost = {
      $push: {'reputation.voters': voterId},
    };
    coefficient === 1
    ? updateThisPost['$inc'] = {'reputation.upvotes': 1}
    : updateThisPost['$inc'] = {'reputation.downvotes': 1};
    Post.findByIdAndUpdate(postId, updateThisPost).exec();
    if (post.originType === 'Flux') {
      User.findByIdAndUpdate(post.author, {
        $set: {'reputation.refresh': true}
      }).exec();
    } else {
      console.log('refresh trust rep on next', post.author, post.originName)
      User.update({_id: post.author, 'trustReputation.trust': post.originName}, {
        $set: {'trustReputation.$.refresh': true}
      }).exec();
    }

    return undefined;
  })
  .catch(err => {
    return 'Error while finding post : ' + err;
  });
}

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
  .select('originType originName postType content createdOn reputation')
  .exec();
}

function findPostsFromTrust(trustKey: string): Promise {
  const filter = {
    originType: 'Trust',
    originName: trustKey
  };
  return Post.find(filter)
  .select('postType content createdOn reputation')
  .populate('author', 'fullName reputation')
  .exec();
}

module.exports = posting;
