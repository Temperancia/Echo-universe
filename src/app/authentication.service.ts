import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { AppSettings } from './app.settings';

@Injectable()
export class AuthenticationService {
  public token: string;
  public result: string;
  constructor(private http: HttpClient) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') === null ? false : true;
  }

  isAnonymous(): boolean {
    return JSON.parse(localStorage.getItem('currentUser')).id === undefined ? true : false;
  }

  subscribe(user: any): Observable<any> {
    return this.http.post(AppSettings.API_ENDPOINT + 'authentication/user/create', {
      user: user
    });
  }

  login(credentials): Observable<any> {
    if (credentials) {
      return this.http.post(AppSettings.API_ENDPOINT + 'authentication/user/login', {
        email: credentials.email,
        password: credentials.password
      })
      .pipe(
        catchError(AppSettings.handleError<any>('login'))
      );
    }
    return this.http.get(AppSettings.API_ENDPOINT + 'authentication/user/login');
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
