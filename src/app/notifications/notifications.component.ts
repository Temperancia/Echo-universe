import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';

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
  displayedNotifications: any = {
    'friendRequestsSent': false,
    'friendRequestsReceived': false,
    'trustRequestsSent': false,
    'trustRequestsReceived': false,
    'trustInvitationsSent': false,
    'trustInvitationsReceived': false
  };

  constructor(private userService: UserService) {
  }
  ngOnInit() {
    console.log(this.requestType.FriendRequestSent);
    this.getRequests();
  }
  private getRequests() {
    this.userService.getRequests()
    .subscribe(response => {
      if (response && response.success) {
        this.requests = response.requests;
        console.log(this.requests);

      }
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
}
