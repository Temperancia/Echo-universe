import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  public token: string;
  public result: string;
  constructor(private http: HttpClient) {
    // set token if saved in local storage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }
  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') === null ? false : true;
  }

  isAnonymous(): boolean {
    return JSON.parse(localStorage.getItem('currentUser'))['id'] === undefined ? true : false;
  }

  subscribe(user: any): Observable<any> {
    return this.http.post('http://localhost:4000/api/authentication/user/create', {
      user: user
    });
  }

  login(credentials): Observable<any> {
    if (credentials) {
      return this.http.post('http://localhost:4000/api/authentication/user/login', {
        email: credentials.email,
        password: credentials.password
      })
      .pipe(
        catchError(this.handleError<any>('login'))
      );
    }
    return this.http.get('http://localhost:4000/api/authentication/user/login');
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
