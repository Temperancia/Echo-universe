import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrustService } from '../trust.service';
import { PostService } from '../post.service';
import { Trust } from '../trust';
import { Post } from '../post';
import { AppSettings } from '../app.settings';
import { TrustRole } from '../trust.service';
import { PostType } from '../post-type.enum';

@Component({
  selector: 'app-trust',
  templateUrl: 'trust.component.html',
  styleUrls: ['trust.component.scss']
})
export class TrustComponent implements OnInit {
  name: string;
  key: string;
  /* = {
    name: 'Coventry Starbuckers',
    policies: [
      'be employees of the Starbucks shop in Coventry',
      'dislike coffee !'
    ]
  };
  */
  role: TrustRole;
  postType = PostType;
  owner: any;
  newPolicy: string;
  trustees: any[];
  followers: any[];
  currentPost: any;
  toggles = {
    'home': true,
    'members': false,
    'policies': false
  };
  posts: Post[];
  /*
  posts: Post[] = [
    {
      name: 'Free coffee for new joiners',
      content: 'Dear employees , from now on , we will be providing you fresh free coffee from our own machines as long as you work with our daring team Cheers !',
      owner: 'James Laper',
      createdOn: '13/11/2018 6:39 PM',
      reputation: 34,
      type: 'trust'
    },
    {
      name: 'OMG',
      content: 'I cannot believe you joined this one , cheers Oliver',
      owner: 'Vanessa Prikles',
      createdOn: '13/11/2018 4:20 PM',
      reputation: 5,
      type: 'trust'
    },
    {
      name: 'Hey !!',
      content: 'Super glad to join this trust , thanks for letting me in. Fond of Starbucks since ever !!!',
      owner: 'Oliver Thomson',
      createdOn: '13/11/2018 3:28 AM',
      reputation: 3,
      type: 'trust'
    },
    {
      name: 'Hey !!',
      content: 'Super glad to join this trust , thanks for letting me in. Fond of Starbucks since ever !!!',
      owner: 'Oliver Thomson',
      createdOn: '13/11/2018 3:28 AM',
      reputation: 3,
      type: 'trust'
    },
    {
      name: 'Hey !!',
      content: 'Super glad to join this trust , thanks for letting me in. Fond of Starbucks since ever !!!',
      owner: 'Oliver Thomson',
      createdOn: '13/11/2018 3:28 AM',
      reputation: 3,
      type: 'trust'
    }
  ];
  */
  constructor(private router: Router, private trustService: TrustService, private postService: PostService) {
  }
  ngOnInit() {
    this.currentPost = new Post;
    this.getTrust();
  }
  private getTrust() {
    const url = this.router.url;
    const trustKey = this.key = url.substr(url.lastIndexOf('/') + 1);
    this.trustService.getTrust(trustKey)
    .subscribe(trust => {
      console.log(trust);
      this.name = trust.name;
      this.owner = trust.owner;
      this.followers = trust.members;
      this.trustees = trust.moderators;
      this.defineRole();
      this.getPosts();
    });
  }
  private defineRole(): void {
    const id = AppSettings.getId();
    if (id === this.owner._id) {
      this.role = TrustRole.Inspiration;
    } else if (this.trustees.map(trustee => { return trustee._id }).indexOf(id) > -1) {
      this.role = TrustRole.Trustee;
    } else if (this.followers.map(follower => { return follower._id }).indexOf(id) > -1) {
      this.role = TrustRole.Follower;
    } else {
      this.role = TrustRole.None;
    }
  }
  private getPosts(): void {
    this.postService.getPostsFromTrust(this.key)
    .subscribe(posts => {
      console.log('posts', posts);
      this.posts = posts;
    })
  }
  post(postType: PostType) {
    this.currentPost.originType = 'Trust';
    this.currentPost.originName = decodeURIComponent(this.key);
    this.currentPost.postType = postType;
    this.postService.create(this.currentPost)
    .subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
  createPolicy(): void {
    this.trustService.createPolicy(this.key, this.newPolicy);
  }
  toggle(tab) {
    for (const toggle in this.toggles) {
      this.toggles[toggle] = false;
    }
    this.toggles[tab] = true;
  }
}
