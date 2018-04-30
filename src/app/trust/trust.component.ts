import { Component, OnInit } from '@angular/core';
import { TrustService } from '../trust.service';
import { Friend } from '../friend';
import { Trust } from '../trust';
import { Post } from '../post';

@Component({
  selector: 'app-trust',
  templateUrl: 'trust.component.html',
  styleUrls: ['trust.component.scss']
})
export class TrustComponent implements OnInit {
  trust = 'Coventry Starbuckers';
  owner = 'James Laper';
  policies = {
    'dos': 'be employees of the Starbucks shop in Coventry',
    'donots': 'dislike coffee !'
  }
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
  constructor(private trustService: TrustService) {
  }
  ngOnInit() {
    this.trustService.getMembers(this.trust)
      .subscribe(members => this.members = members);
    this.trustService.getMembers(this.trust)
      .subscribe(members => this.trustees = members);
    this.trustService.getMembers(this.trust)
      .subscribe(members => this.followers = members);
  }
  toggle(tab) {
    for (let toggle in this.toggles) {
      this.toggles[toggle] = false;
    }
    this.toggles[tab] = true;
  }
}
