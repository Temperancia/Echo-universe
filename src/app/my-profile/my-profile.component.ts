import { Component, OnInit } from '@angular/core';
import {Friend} from '../friend';
import {FriendService} from '../friend.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: 'my-profile.component.html',
  styles: []
})
export class MyProfileComponent implements OnInit {
  public friends: Friend[];
  constructor(private friendService: FriendService) { }

  ngOnInit() {
    this.friendService.getFriends()
      .subscribe(friends => this.friends = friends);
  }
  public getReputation(friend: Friend): string {
    return friend.reputation >= 0 ? 'green' : 'red';
  }
  public getFeedClass(): string {

    return 'col-12';
  }
}
