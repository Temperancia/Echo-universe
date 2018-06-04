import { job } from 'cron';
import { User } from './models/user';
import { Post } from './models/post';

function reputationCalculation() {
  console.log('ok');
  User.find({'reputation.refresh': true})
  .select('reputation')
  .then(users => {
    for (const user of users) {
      Post.find({author: user._id})
      .select('reputation')
      .then(posts => {
        const upvotes = posts.map(post => post.reputation.upvotes);
        const downvotes = posts.map(post => post.reputation.downvotes);
        const upvoteSum = upvotes.reduce((a, b) => a + b, 0);
        const downvoteSum = downvotes.reduce((a, b) => a + b, 0);
        const score = upvoteSum + downvoteSum;
        const rank = Math.trunc(Math.log(score));
        console.log(user._id, score, rank);
        User.findByIdAndUpdate(user._id, {
          $set: {
            'reputation.refresh': false,
            'reputation.score': score,
            'reputation.rank': rank
          }
        }).exec();
      });
    }
  });
}

job('0 0 * * * *', reputationCalculation, null, true, null, null, true);
