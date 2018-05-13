import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from '../post.service';
import { FeedComponent } from '../feed/feed.component';
import { Flux } from '../flux.enum';
import { Post } from '../post';

@Component({
  selector: 'app-feed-home',
  templateUrl: 'feed-home.component.html',
  styleUrls: ['feed-home.component.scss']
})
export class FeedHomeComponent extends FeedComponent {
  flux = Flux;
  feed$: Observable<Post[]>;
  constructor(protected postService: PostService) {
    super(postService);
  }
  ngOnInit() {
    this.launchFeed();
  }
  launchFeed() {
    this.feed$ = this.postService.getFeed();
  }
}
