import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Trust } from './trust';
import { AppSettings } from './app.settings';

export enum UserType {
  Moderator = 'Moderator',
  Public = 'Public',
  Eminent = 'Eminent',
  Anonymous = 'Anonymous'
}

@Injectable()
export class UserService {
  friends: User[];
  constructor(private http: HttpClient) {
  }
  public convertIntoFullName(user: User) {
    if (user.type === UserType.Public) {
      user.fullName = user.firstName + ' ' + user.lastName;
    } else if (user.type === UserType.Eminent) {
      user.fullName = user.userName;
    }
  }
  public convertIntoFullNames(users: User[]) {
    for (let user of users) {
      this.convertIntoFullName(user);
    }
  }
  getFriends(id=AppSettings.getId()): Observable<any> {
    const url = AppSettings.API_ENDPOINT + 'user/' + id + '/friends';
    return this.http.get<any>(url)
    .pipe(
      tap(friends => {
        this.convertIntoFullNames(friends);
      }),
      catchError(AppSettings.handleError('getFriends', []))
    );
  }
  getRequests(): Observable<any> {
    const url = AppSettings.API_ENDPOINT + 'user/requests';
    return this.http.get<any>(url)
    .pipe(
      catchError(AppSettings.handleError('getRequests', []))
    );
  }
  getTrusts(id=AppSettings.getId()): Observable<any> {
    const url = AppSettings.API_ENDPOINT + 'user/' + id + '/trusts';
    return this.http.get<any>(url)
    .pipe(
      catchError(AppSettings.handleError('getTrusts', []))
    );
  }
  getUsers(name = undefined): Observable<any> {
    let url = AppSettings.API_ENDPOINT + 'user/users';
    if (name) {
      url += '?name=' + name;
    }
    return this.http.get<any>(url);
  }
  getFriendableUsers(name: string = undefined): Observable<any> {
    return Observable.forkJoin([
      this.getFriends(),
      this.getUsers(name)
    ])
    .pipe(
      tap(data => {
        const friends = data[0].map((friend) => { return friend._id });
        let users = data[1];
        for (let user of users) {
          user.friendWith = (user._id in friends);
        }
        this.convertIntoFullNames(users);
      }),
      map((data: any[]) => data[1])
    );
  }
  getUser(id=AppSettings.getId()): Observable<any> {
    const url = AppSettings.API_ENDPOINT + 'user/' + id + '/profile';
    return this.http.get<any>(url)
    .pipe(
      tap(response => {
        this.convertIntoFullName(response.user);
      }),
      catchError(AppSettings.handleError('getUser', []))
    );
  }
}
