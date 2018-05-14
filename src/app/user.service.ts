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
  getFriends(id=AppSettings.getId()): Observable<any> {
    const url = AppSettings.API_ENDPOINT + 'user/' + id + '/friends';
    return this.http.get<any>(url)
    .pipe(
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
  getUsers(name = undefined): Observable<User[]> {
    let url = AppSettings.API_ENDPOINT + 'user/users';
    if (name) {
      url += '?name=' + name;
    }
    return this.http.get<User[]>(url);
  }
  getFriendableUsers(name: string = undefined): Observable<any> {
    return Observable.forkJoin([
      this.getFriends(),
      this.getUsers(name),
      this.getRequests()
    ])
    .pipe(
      tap(data => {
        const friends = data[0].map(friend => { return friend._id });
        const requests = data[2];
        let users = data[1];
        for (let user of users) {
          user.friendWith = (user._id in friends);
          user.friendable = (user._id in requests.friends)
        }
        console.log(users);
      }),
      map((data: any[]) => data[1])
    );
  }
  getUser(id=AppSettings.getId()): Observable<any> {
    const url = AppSettings.API_ENDPOINT + 'user/' + id + '/profile';
    return this.http.get<any>(url)
    .pipe(
      catchError(AppSettings.handleError('getUser', []))
    );
  }
}
