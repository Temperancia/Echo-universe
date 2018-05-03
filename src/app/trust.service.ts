import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Trust } from './trust';
import { Friend } from './friend';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { AppSettings } from './app.settings';

@Injectable()
export class TrustService {
  constructor(private http: HttpClient) {
  }
  createTrust(trust: any): Observable<any> {
    return this.http.post(AppSettings.API_ENDPOINT + 'trusting/trusts/create', {
      trust: trust
    });
  }
  joinTrust(name: string): Observable<any> {
    return this.http.get(AppSettings.API_ENDPOINT + 'trusting/trust/' + name + '/join');
  }
  getTrusts(): Observable<Trust[]> {
    return this.http.get<Trust[]>(AppSettings.API_ENDPOINT + 'trusting/trusts/get/?token=' + JSON.parse(localStorage.getItem('currentUser'))['token']);
  }
  getMembers(trust): Observable<Friend[]> {
    let members = [
      {
        name: "Vanessa Prikles",
        reputation: 34
      },
      {
        name: "James Laper",
        reputation: 6
      },
      {
        name: "Oliver Thomson",
        reputation: 22
      }
    ];
    return of(members);
  }
}
