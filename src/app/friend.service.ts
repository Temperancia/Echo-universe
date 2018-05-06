import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { AppSettings } from './app.settings';

@Injectable()
export class FriendService {
  /*
  private friends: Friend[] = [
    {name: 'Nadir', reputation: 23},
    {name: 'Bruno', reputation: 9000},
    {name: 'James', reputation: -42}
  ];
  */
  friends: User[];
  constructor(private http: HttpClient) {
  }
  addFriend(id: string): Observable<boolean> {
    const url = AppSettings.API_ENDPOINT + 'friends/user/request/' + id;
    console.log(url);
    return this.http.get<boolean>(url);
  }
}
