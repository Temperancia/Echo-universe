import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post';

@Component({
  selector: 'app-post-box',
  templateUrl: 'post-box.component.html',
  styleUrls: ['post-box.component.scss']
})
export class PostBoxComponent implements OnInit {
  public currentPost: Post;
  private onTitle: boolean;
  private onContent: boolean;
  constructor(private postService: PostService) {
  }
  ngOnInit() {
    this.newPost();
  }
  public selectTitle() {
    this.onTitle = true;
    this.onContent = false;
  }
  public selectContent() {
    this.onTitle = false;
    this.onContent = true;
  }
  public onEmoji(emoji) {
    if (this.onTitle) {
      this.currentPost.name += emoji;
    } else if (this.onContent) {
      this.currentPost.content += emoji;
    }
  }
  public newPost () {
    this.currentPost = {
      id: -1,
      name: '',
      content: ''
    };
  }
  public post(): void {
    if (this.currentPost.name !== '' && this.currentPost.content !== '') {
      this.postService.create(this.currentPost);
      this.newPost();
    }
  }
}
