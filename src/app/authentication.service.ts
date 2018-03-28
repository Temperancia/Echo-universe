import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

@Injectable()
export class AuthenticationService {
  public token: string;

  constructor() {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }
  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') === null ? false : true;
  }

  login(username: string, password: string): Observable<boolean> {
    if (username === 'user' && password === 'pass') {
      localStorage.setItem('currentUser', JSON.stringify({ username: username }));
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
