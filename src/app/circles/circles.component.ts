import {Component, OnInit} from '@angular/core';
import {Friend} from '../friend';
import {FriendService} from '../friend.service';

@Component({
  selector: 'circles-component',
  templateUrl: 'circles.component.html'
})
export class CirclesComponent implements OnInit {
  friends: Friend[];
  constructor(private friendService: FriendService) {

  }
  ngOnInit() {
    this.friendService.getFriends()
      .subscribe(friends => this.friends = friends);
  }

}
