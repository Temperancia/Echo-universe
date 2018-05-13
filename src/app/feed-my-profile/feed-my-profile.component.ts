import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from '../post.service';
import { FeedComponent } from '../feed/feed.component';
import { Post } from '../post';

@Component({
  selector: 'app-feed-my-profile',
  templateUrl: 'feed-my-profile.component.html'
})
export class FeedMyProfileComponent extends FeedComponent {
  posts: Post[];
  constructor(protected postService: PostService) {
    super(postService);
  }
  ngOnInit() {
    this.getPosts();
  }
  getPosts() {
    this.postService.getPostsFromUser()
    .subscribe(posts => this.posts = posts);
  }
}
