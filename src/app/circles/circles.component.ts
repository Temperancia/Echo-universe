import {Component, OnInit} from '@angular/core';
import {Trust} from '../trust';
import {User} from '../user';
import {UserService} from '../user.service';

@Component({
  selector: 'circles-component',
  templateUrl: 'circles.component.html'
})
export class CirclesComponent implements OnInit {
  showTrusts: boolean = false;
  showFriends: boolean = true;
  ownedTrusts: Trust[] = [];
  joinedTrusts: Trust[] = [];
  trustsRequests: any = [];
  friendsRequests: any = [];
  friends: User[] = [];
  constructor(private userService: UserService) {

  }
  ngOnInit() {
    this.userService.getTrusts()
    .subscribe(response => {
      if (response && response['success']) {
        this.ownedTrusts = response['trustsOwned'];
        this.joinedTrusts = response['trustsJoined'];
      }
    });
    this.userService.getRequests()
    .subscribe(response => {
      if (response && response['success']) {
        console.log(response);
        this.trustsRequests = response['trustsRequesting'];
        this.friendsRequests = response['friendsRequests'];
      }
    });
    this.userService.getFriends()
    .subscribe(response => {
      if (response && response['success']) {
        this.friends = response['friends']
      }
    });
  }
  getRequestsClass(): string {
    if (this.trustsRequests.length !== 0 && this.friendsRequests.length !== 0) {
      return 'col-6';
    }
    return 'offset-3 col-6';
  }
}
