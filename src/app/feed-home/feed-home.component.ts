import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from '../post.service';
import { FeedComponent } from '../feed/feed.component';
import { Flux } from '../flux.enum';
import { Post } from '../post';
import { AppSettings } from '../app.settings';

@Component({
  selector: 'app-feed-home',
  templateUrl: 'feed-home.component.html',
  styleUrls: ['feed-home.component.scss']
})
export class FeedHomeComponent extends FeedComponent {
  flux = Flux;
  feed$: Observable<Post[]>;
  constructor(private router: Router, protected postService: PostService) {
    super(postService);
  }
  ngOnInit() {
    this.launchFeed();
  }
  launchFeed() {
    this.feed$ = this.postService.getFeed();
  }
  canVote(authorId: string, voters: any[]): boolean {
    const id = AppSettings.getId();
    return id !== authorId && !(voters.find(voter => { return voter === id; }));
  }
  upvote(postId) {
    this.postService.upvote(postId).subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
  downvote(postId) {
    this.postService.downvote(postId).subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
}
