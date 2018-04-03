import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


@Injectable()
export class AuthenticationService {
  public token: string;

  constructor(private http: HttpClient) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }
  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') === null ? false : true;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post('http://localhost:4000/api/authentication/user/login', {
      email: username,
      password: password
    }).map(response => {
      console.log(response);
      if (response['success']) {
        localStorage.setItem('currentUser', JSON.stringify({ username: username, token: response['token'] }));
        return of(true);
      } else {
        return of(false);
      }
    });
    console.log('ok');
    return of(false);
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
