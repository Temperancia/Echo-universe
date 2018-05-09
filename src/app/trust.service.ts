import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Trust } from './trust';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './app.settings';

export enum TrustRole {
  Inspiration,
  Trustee,
  Follower,
  None
}

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
    return this.http.get<Trust[]>(AppSettings.API_ENDPOINT + 'trusting/trusts/get');
  }
  getTrust(trustKey: string): Observable<Trust> {
    return this.http.get<Trust>(AppSettings.API_ENDPOINT + 'trusting/trust/' + trustKey + '/get')
  }
  createPolicy(trustKey: string, newPolicy: string) {

  }
  /*
  getMembers(trust): Observable<User[]> {
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
  */
}
