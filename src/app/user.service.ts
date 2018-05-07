import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Trust } from './trust';
import { AppSettings } from './app.settings';

@Injectable()
export class UserService {
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
  getFriends(id=AppSettings.getId()): Observable<User[]> {
    const url = AppSettings.API_ENDPOINT + 'user/' + id + '/friends';
    return this.http.get<User[]>(url);
  }
  getRequests(): Observable<any> {
    const url = AppSettings.API_ENDPOINT + 'user/requests';
    return this.http.get<any>(url);
  }
  getTrusts(id=AppSettings.getId()): Observable<Trust[]> {
    const url = AppSettings.API_ENDPOINT + 'user/' + id + '/trusts';
    return this.http.get<Trust[]>(url);
  }
  getUsers(): Observable<User[]> {
    const url = AppSettings.API_ENDPOINT + 'user/users';
    return this.http.get<User[]>(url);
  }
  getUser(id=AppSettings.getId()): Observable<User> {
    const url = AppSettings.API_ENDPOINT + 'user/' + id + '/profile';
    return this.http.get<User>(url);
  }
}
