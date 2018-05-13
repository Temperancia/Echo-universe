import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, group } from '@angular/animations';
import { PostService } from '../post.service';
import { Post } from '../post';
import { Flux } from '../flux.enum';

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
  constructor(private postService: PostService) {
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
  public post(): void {
    if (this.currentPost.content && this.currentPost.originName) {
      this.postService.create(this.currentPost)
      .subscribe(_ => {
        location.reload();
      });
    }
  }
}
