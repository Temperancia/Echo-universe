import {Component, OnInit} from '@angular/core';
import {Friend} from '../friend';
import {FriendService} from '../friend.service';

@Component({
  selector: 'home-component',
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  private friends: Friend[];
  constructor(private friendService: FriendService) {

  }
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
