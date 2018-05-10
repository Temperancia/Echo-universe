import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export class AppSettings {
   public static API_ENDPOINT='http://localhost:4000/api/';
   static getToken(): string {
     return JSON.parse(localStorage.getItem('currentUser')).token;
   }
   static getId(): string {
      return JSON.parse(localStorage.getItem('currentUser')).id;
   }
   static handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(error);
      return of(result as T);
    };
  }
}
