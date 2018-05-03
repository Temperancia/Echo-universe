import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.component.html'
})
export class FeedComponent implements OnInit {
  public posts: Post[];
  constructor(protected postService: PostService) {

  }
  ngOnInit() {

  }
  getPostTypeStyle (type: string): string {
    if (type === 'friends') {
      return 'post-friend';
    } else if (type === 'trending') {
      return 'post-tendance';
    }
  }

}
