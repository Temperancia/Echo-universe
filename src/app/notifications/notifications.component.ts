import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../user.service';
import { FriendService } from '../friend.service';
import { TrustService } from '../trust.service';
import { AppSettings } from '../app.settings';

export enum RequestType {
  FriendRequestSent = 'friendRequestSent',
  FriendRequestReceived = 'FriendRequestReceived',
  trustRequestSent = 'trustRequestSent',
  trustRequestReceived = 'trustRequestReceived',
  trustInvitationSent = 'FriendRequestReceived',
  trustInvitationReceived = 'FriendRequestReceived'
}

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  requests: any;
  requestType = RequestType;
  displayedNotifications = AppSettings.displayedNotifications;
  constructor(private router: Router,
    private friendService: FriendService,
    private trustService: TrustService,
    private userService: UserService) {
  }
  ngOnInit() {
    this.getRequests();
  }
  private getRequests() {
    this.userService.getRequests()
    .subscribe(requests => {
      this.requests = requests;
    });
  }
  getRequestsClass(): string {
    if (!this.requests) {
      return '';
    }
    return 'offset-3 col-6';
  }
  private toggle(type: string) {
    this.displayedNotifications[type] = !this.displayedNotifications[type];
  }
  cancelFriendRequest(request) {
    this.friendService.cancelFriend(request._id).subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
  acceptFriendRequest(request) {
    this.friendService.acceptFriend(request._id).subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
  declineFriendRequest(request) {
    this.friendService.declineFriend(request._id).subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
  cancelTrustRequest(request) {
    this.friendService.cancelFriend(request._id).subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
  acceptTrustRequest(request) {
    this.friendService.acceptFriend(request._id).subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
  declineTrustRequest(request) {
    this.friendService.declineFriend(request._id).subscribe(_ => {
      AppSettings.refresh(this.router);
    });
  }
}
