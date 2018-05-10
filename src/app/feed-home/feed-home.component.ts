import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FeedComponent } from '../feed/feed.component';

@Component({
  selector: 'app-feed-home',
  templateUrl: 'feed-home.component.html',
  styleUrls: ['feed-home.component.scss']
})
export class FeedHomeComponent extends FeedComponent {
  constructor(protected postService: PostService) {
    super(postService);
  }
  ngOnInit() {
    //this.postService.getPosts().subscribe(posts => this.posts = posts);
  }
}
