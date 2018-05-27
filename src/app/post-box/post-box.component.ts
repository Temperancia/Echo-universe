import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, transition, animate, group } from '@angular/animations';
import { PostService } from '../post.service';
import { Post } from '../post';
import { Flux } from '../flux.enum';
import { PostType } from '../post-type.enum';
import { AppSettings } from '../app.settings';

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
  flux = Flux;
  currentFlux: Flux;
  postType = PostType;
  constructor(private router: Router, private postService: PostService) {
  }
  ngOnInit() {
    this.currentPost = new Post;
  }
  public onEmoji(emoji) {
    this.currentPost += emoji;
  }
  toggle(flux: Flux) {
    this.currentFlux = flux;
    this.currentPost.originType = 'Flux';
    this.currentPost.originName = flux;
  }
  public post(postType: PostType): void {
    this.currentPost.postType = postType;
    this.postService.create(this.currentPost)
    .subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
}
