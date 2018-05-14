import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';

export class AppSettings {
  public static API_ENDPOINT='http://localhost:4000/api/';
  static displayedNotifications: any = {
    'friendRequestsSent': false,
    'friendRequestsReceived': false,
    'trustRequestsSent': false,
    'trustRequestsReceived': false,
    'trustInvitationsSent': false,
    'trustInvitationsReceived': false
  };
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
  static refresh(router: Router) {
    const previousUrl = router.url;
    router.navigateByUrl('blank', { skipLocationChange: true }).then(_ => {
      router.navigateByUrl(previousUrl);
    });
  }
}
