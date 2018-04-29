import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Trust } from './trust';
import { Friend } from './friend';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TrustService {
  constructor(private http: HttpClient) {
  }
  createTrust(trust: Trust): void {
    this.http.post('http://localhost:4000/api/trusting/trusts/create', {
      trust: trust,
      owner: JSON.parse(localStorage.getItem('currentUser'))['id']
    });
  }
  getTrusts(): Observable<Trust[]> {
    return this.http.get<Trust[]>('http://localhost:4000/api/trusting/trusts/?token=' + JSON.parse(localStorage.getItem('currentUser'))['token']);
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
