import { Component, OnInit, Input } from '@angular/core';
import {PostService} from '../post.service';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() app: string;
  public isLoggedIn: boolean;
  public showPost = false;
  constructor(private postService: PostService,
               private authenticationService: AuthenticationService,
               public router: Router
              ) {
  }
  ngOnInit() {
    this.isLoggedIn = this.authenticationService.isLoggedIn();
  }
  public showPostBox(): void {
    this.showPost = !this.showPost;
  }
  public showTrendingFlux(): void {
    this.postService.displayedFluxes.trending = !this.postService.displayedFluxes.trending;
  }
  public showFriendsFlux(): void {
    this.postService.displayedFluxes.friends = !this.postService.displayedFluxes.friends;
  }
  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
