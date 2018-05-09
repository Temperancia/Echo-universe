import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrustService } from '../trust.service';
import { Trust } from '../trust';
import { Post } from '../post';
import { AppSettings } from '../app.settings';
import { TrustRole } from '../trust.service';

@Component({
  selector: 'app-trust',
  templateUrl: 'trust.component.html',
  styleUrls: ['trust.component.scss']
})
export class TrustComponent implements OnInit {
  trust: any;
  /* = {
    name: 'Coventry Starbuckers',
    policies: [
      'be employees of the Starbucks shop in Coventry',
      'dislike coffee !'
    ]
  };
  */
  role: TrustRole;
  owner = 'James Laper';
  newPolicy: string;
  trustees: any[];
  members: any[];
  followers: any[];
  currentPost: any = {};
  toggles = {
    'home': true,
    'members': false,
    'policies': false
  };
  posts: Post[] = [
    {
      name: 'Free coffee for new joiners',
      content: 'Dear employees , from now on , we will be providing you fresh free coffee from our own machines as long as you work with our daring team Cheers !',
      owner: 'James Laper',
      createdOn: '13/11/2018 6:39 PM',
      reputation: 34
    },
    {
      name: 'OMG',
      content: 'I cannot believe you joined this one , cheers Oliver',
      owner: 'Vanessa Prikles',
      createdOn: '13/11/2018 4:20 PM',
      reputation: 5
    },
    {
      name: 'Hey !!',
      content: 'Super glad to join this trust , thanks for letting me in. Fond of Starbucks since ever !!!',
      owner: 'Oliver Thomson',
      createdOn: '13/11/2018 3:28 AM',
      reputation: 3
    },
    {
      name: 'Hey !!',
      content: 'Super glad to join this trust , thanks for letting me in. Fond of Starbucks since ever !!!',
      owner: 'Oliver Thomson',
      createdOn: '13/11/2018 3:28 AM',
      reputation: 3
    },
    {
      name: 'Hey !!',
      content: 'Super glad to join this trust , thanks for letting me in. Fond of Starbucks since ever !!!',
      owner: 'Oliver Thomson',
      createdOn: '13/11/2018 3:28 AM',
      reputation: 3
    }
  ];
  constructor(private router: Router, private trustService: TrustService) {
  }
  ngOnInit() {
    this.getTrust();
    this.defineRole();
    /*
    this.trustService.getMembers(this.trust)
      .subscribe(members => this.members = members);
    this.trustService.getMembers(this.trust)
      .subscribe(members => this.trustees = members);
    this.trustService.getMembers(this.trust)
      .subscribe(members => this.followers = members);
      */
  }
  private defineRole(): void {
    if (!this.trust) {
      return;
    }
    const id = AppSettings.getId();
    if (id === this.trust.owner.id) {
      this.role = TrustRole.Inspiration;
    } else if (id in this.trust.moderators) {
      this.role = TrustRole.Trustee;
    } else if (id in this.trust.members) {
      this.role = TrustRole.Follower;
    } else {
      this.role = TrustRole.None;
    }
  }
  private getTrust() {
    const url = this.router.url;
    const trustKey = url.substr(url.lastIndexOf('/') + 1);
    this.trustService.getTrust(trustKey)
    .subscribe(response => {
      console.log(response);
      if (response && response['success']) {
        this.trust = response['trust'];
      }
    });
  }
  createPolicy(): void {
    this.trustService.createPolicy(this.trust.key, this.newPolicy);
  }
  toggle(tab) {
    for (let toggle in this.toggles) {
      this.toggles[toggle] = false;
    }
    this.toggles[tab] = true;
  }
}
