import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap, tap
 } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Post } from './post';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './app.settings';
import { Flux } from './flux.enum';

@Injectable()
export class PostService {
  feed = new Subject<string>();

  constructor(private http: HttpClient) {

  }
  create(post: Post) {
    return this.http.post(AppSettings.API_ENDPOINT + 'posting/posts/create', {
      post: post
    })
    .pipe(
      catchError(AppSettings.handleError('create', []))
    );
  }
  updateFeed(displayedFluxes: any) {
    let fluxes = '';
    for (const [flux, displayed] of Object.entries(displayedFluxes)) {
      if (displayed) {
        fluxes += flux + '+';
      }
    }
    if (fluxes !== '') {
      this.feed.next(fluxes.substring(0, fluxes.length - 1));
    }
  }
  getFeed(): Observable<Post[]> {
    return this.feed.pipe(
      debounceTime(300),
      switchMap((fluxes: string) => this.getPostsFromFlux(fluxes)),
    );
  }
  getPostsFromFlux(fluxes: string): Observable<Post[]> {
    return this.http.get<Post[]>(AppSettings.API_ENDPOINT + 'posting/posts/get?type=Flux&origin=' + fluxes);
  }
  getPostsFromUser(id=AppSettings.getId()): Observable<Post[]> {
    return this.http.get<Post[]>(AppSettings.API_ENDPOINT + 'posting/posts/get?user=' + id);
  }
  getPostsFromTrust(key: string): Observable<Post[]> {
    return this.http.get<Post[]>(AppSettings.API_ENDPOINT + 'posting/posts/get?type=Trust&origin=' + key);
  }
}
