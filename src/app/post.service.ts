import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Post } from './post';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class PostService {
  private oposts: Post[] = [
    {id: 1, name: 'own', content: 'hello', createdOn: '23/10/15', reputation: 23}
  ];
  private fposts: Post[] = [
    {id: 1, name: 'friend', content: 'hello', createdOn: '23/10/15', reputation: 23},
  ];
  private tposts: Post[] = [
    {id: 1, name: 'trending', content: 'hello', createdOn: '23/10/15', reputation: 23},
  ];
  public displayedFluxes = {
    'trending': false,
    'friends': false,
    'daily': false,
    'style': false
  };
  constructor(private http: HttpClient) {
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
    //return this.http.get<Post[]>('/api/user');
    return of(this.fposts.concat(this.tposts));
  }
  getOwnPosts(): Observable<Post[]> {
    //return this.http.get<Post[]>('/api/posts');
    return of(this.oposts);
  }
  create(post: Post) {
    //post.id = this.posts.length;
    //this.posts.unshift(post);
  }
}
