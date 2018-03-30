import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.component.html',
  styleUrls: ['feed.component.scss']
})
export class FeedComponent implements OnInit {
  public posts: Post[];
  constructor(protected postService: PostService) {

  }
  ngOnInit() {

  }
  public close(id) {
    /*
    for (let index = 0; index < this.posts.length; index++) {
      if (this.posts[index].id === id) {
        this.posts.splice(index, 1);
      }
    }
    */
  }
}
