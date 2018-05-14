import {Component, OnInit} from '@angular/core';
import {Trust} from '../trust';
import {User} from '../user';
import {UserService} from '../user.service';
import {FriendService} from '../friend.service';

@Component({
  selector: 'circles-component',
  templateUrl: 'circles.component.html'
})
export class CirclesComponent implements OnInit {
  showTrusts: boolean = false;
  showFriends: boolean = true;
  ownedTrusts: Trust[];
  joinedTrusts: Trust[];

  friends: User[];
  constructor(private userService: UserService, private friendService: FriendService) {

  }
  ngOnInit() {
    this.getTrusts();
    this.getFriends();
  }
  private getTrusts() {
    this.userService.getTrusts()
    .subscribe(response => {
      console.log(response);
      this.ownedTrusts = response.trustsOwned;
      this.joinedTrusts = response.trustsJoined;
    }, err => {
      console.log(err);
    });
  }

  private getFriends() {
    this.userService.getFriends()
    .subscribe(friends => {
      this.friends = friends;
      console.log(friends);
    }, err => {
      console.log(err);
    });
  }

  acceptFriend(id: string): void {
    this.friendService.acceptFriend(id)
    .subscribe(response => {
      location.reload();
    });
  }
}
