import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FriendService } from '../friend.service';
import { User } from '../user';
@Component({
  selector: 'app-search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  users: User[] = [];
  usersDisplayed: User[] = [];
  constructor(private userService: UserService, private friendService: FriendService) { }

  ngOnInit() {
    this.userService.getUsers()
    .subscribe(response => {
      if (response && response['success']) {
        this.users = response['users'];
      }
    })
  }
  update(rawInput) {
    this.usersDisplayed = [];
    const input = rawInput.toLocaleLowerCase();
    for (const user of this.users) {
      if (user) {
        if (user.firstName && user.lastName) {
          const userFirstName = user.firstName.toLocaleLowerCase();
          const userLastName = user.lastName.toLocaleLowerCase();
          if (userFirstName.startsWith(input)
          || userLastName.startsWith(input)) {
            this.usersDisplayed.push(user);
          }
        } else if (user.userName) {
          const userUserName = user.userName.toLocaleLowerCase();
          if (userUserName.startsWith(input)) {
            this.usersDisplayed.push(user);
          }
        }
      }
    }
  }
  addFriend(id: string) {
    console.log(id);
    this.friendService.addFriend(id)
    .subscribe(response => {
      if (response && response['success']) {
        location.reload();
      }
    })
  }
}
