import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FeedComponent } from '../feed/feed.component';

@Component({
  selector: 'app-feed-my-profile',
  templateUrl: 'feed-my-profile.component.html'
})
export class FeedMyProfileComponent extends FeedComponent {
  constructor(protected postService: PostService) {
    super(postService);
  }
  ngOnInit() {
    this.postService.getOwnPosts().subscribe(posts => this.posts = posts);
  }

}
