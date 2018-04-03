import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
import 'rxjs/Rx';


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
  subscribe(email: string, password: string): Observable<Boolean> {
    this.http.post('http://localhost:4000/api/authentication/user/create', {
      email: email,
      password: password
    }).subscribe(
      data => console.log(data)
    );
    return of(true);
  }

  login(username: string, password: string): Observable<Boolean> {
    this.http.post('http://localhost:4000/api/authentication/user/login', {
      email: username,
      password: password
    })
    .subscribe(
      data => console.log(data)
    );
    return of(true);
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
