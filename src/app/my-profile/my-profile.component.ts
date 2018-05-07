import { Component, OnInit } from '@angular/core';
import {User} from '../user';
import {UserService} from '../user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: 'my-profile.component.html',
  styles: []
})
export class MyProfileComponent implements OnInit {
  public friends: User[];
  user: any;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getFriends()
      .subscribe(friends => this.friends = friends);
    this.getProfile();
  }
  public getProfile(): void {
    this.userService.getUser()
    .subscribe(user => {
      
    });
  }
  public getReputation(friend: User): string {
    return friend.reputation >= 0 ? 'green' : 'red';
  }
  public getFeedClass(): string {

    return 'col-12';
  }
}
