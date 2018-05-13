import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
import { UserService } from '../user.service';
import { FriendService } from '../friend.service';
import { User } from '../user';
@Component({
  selector: 'app-search-box',
  templateUrl: 'search-box.component.html',
  styleUrls: ['search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  users$: Observable<User[]>;
  private searchTerms = new Subject<string>();
  constructor(private userService: UserService,
    private friendService: FriendService) { }

  ngOnInit() {
    this.launchSearch();
  }
  launchSearch() {
    this.users$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.userService.getFriendableUsers(term)),
    );
  }
  search(input: string) {
    this.searchTerms.next(input);
  }
  addFriend(id: string) {
    this.friendService.addFriend(id)
    .subscribe(_ => {
      location.reload();
    })
  }
}
