import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';

export const API_ENDPOINT='http://localhost:4000/api/';
export const displayedFluxes = {
  Tendance: false,
  Friends: false,
  DailyLife: false,
  LifeStyle: false
};
export const displayedNotifications: any = {
  'friendRequestsSent': false,
  'friendRequestsReceived': false,
  'trustRequestsSent': false,
  'trustRequestsReceived': false,
  'trustInvitationsSent': false,
  'trustInvitationsReceived': false
};
export function getToken(): string {
  return JSON.parse(localStorage.getItem('currentUser')).token;
}
export function getId(): string {
  return JSON.parse(localStorage.getItem('currentUser')).id;
}
export function handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.log(error);
    return of(result as T);
  };
}
export function refresh(router: Router) {
  const previousUrl = router.url;
  router.navigateByUrl('blank', { skipLocationChange: true }).then(_ => {
    router.navigateByUrl(previousUrl);
  });
}
