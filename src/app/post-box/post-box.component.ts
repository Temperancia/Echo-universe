import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, group } from '@angular/animations';
import { PostService } from '../post.service';
import { Post } from '../post';

@Component({
  selector: 'app-post-box',
  templateUrl: 'post-box.component.html',
  styleUrls: ['post-box.component.scss'],
  animations: [
    trigger('itemAnim', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate(350)
      ]),
      transition(':leave', [
        group([
          animate('0.2s ease', style({
            transform: 'translate(150px,25px)'
          })),
          animate('0.5s 0.2s ease', style({
            opacity: 0
          }))
        ])
      ])
    ])
  ]
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
      name: '',
      content: '',
      owner: '',
      createdOn: '',
      reputation: 0,
      type: ''
    };
  }
  public post(): void {
    if (this.currentPost.name !== '' && this.currentPost.content !== '') {
      this.postService.create(this.currentPost);
      this.newPost();
    }
  }
}
