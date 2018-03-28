import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Post } from './post';

@Injectable()
export class PostService {
  private fposts: Post[] = [
    {id: 1, name: 'friend', content: 'hello'},
  ];
  private tposts: Post[] = [
    {id: 1, name: 'trending', content: 'hello'},
  ];
  public displayedFluxes = {
    'trending': false,
    'friends': false
  };
  constructor() {
    for (let iPost = 0; iPost < this.tposts.length; iPost++) {
      const post = this.tposts[iPost];
      post['type'] = 'trending';
      this.tposts[iPost] = post;
    }
    for (let iPost = 0; iPost < this.fposts.length; iPost++) {
      const post = this.fposts[iPost];
      post['type'] = 'friends';
      this.fposts[iPost] = post;
    }
  }
  getPosts(): Observable<Post[]> {
    return of(this.fposts.concat(this.tposts));
  }
  create(post: Post) {
    //post.id = this.posts.length;
    //this.posts.unshift(post);
  }
}
