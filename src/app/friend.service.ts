import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { AppSettings } from './app.settings';

@Injectable()
export class FriendService {
  friends: User[];
  constructor(private http: HttpClient) {
  }
  addFriend(id: string): Observable<any> {
    const url = AppSettings.API_ENDPOINT + 'friends/user/request/' + id;
    return this.http.get<any>(url);
  }
  acceptFriend(id: string): Observable<any> {
    const url = AppSettings.API_ENDPOINT + 'friends/user/accept/' + id;
    return this.http.get<any>(url);
  }
}
