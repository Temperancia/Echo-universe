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
  public showFlux = false;
  public showOptions = false;
  constructor(private postService: PostService,
               private authenticationService: AuthenticationService
              ) {
  }
  ngOnInit() {
    this.isLoggedIn = this.authenticationService.isLoggedIn();
  }
  public showPostBox(): void {
    this.showPost = !this.showPost;
  }
  public showFluxBox(): void {
    this.showFlux = !this.showFlux;
  }
  public showOptionsBox(): void {
    this.showOptions = !this.showOptions;
  }
}
