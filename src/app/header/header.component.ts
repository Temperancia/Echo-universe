import { Component, OnInit, Input } from '@angular/core';
import { trigger, style, transition, animate, group } from '@angular/animations';
import {PostService} from '../post.service';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
  animations: [
    trigger('itemAnim', [
      transition(':leave', [
        group([
          animate('0.2s ease', style({
            transform: 'translate(150px,25px)'
          })),
          animate('0.5s 0.2s ease', style({
            opacity: 0
          }))
        ])
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  @Input() app: string;
  public isLoggedIn: boolean;
  public isAnonymous: boolean;
  public showPost = false;
  public showFlux = false;
  public showOptions = false;

  constructor(private postService: PostService,
               private authenticationService: AuthenticationService,
               private router: Router
              ) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authenticationService.isLoggedIn();
    this.isAnonymous = this.authenticationService.isAnonymous();
  }

  public showPostBox(): void {
    this.showPost = !this.showPost;
    this.showFlux = false;
    this.showOptions = false;
  }

  public showFluxBox(): void {
    if (this.router.url !== '/home') {
      this.router.navigate(['/home']);
    } else {
      this.showFlux = !this.showFlux;
      this.showPost = false;
      this.showOptions = false;
    }
  }

  public showOptionsBox(): void {
    this.showOptions = !this.showOptions;
    this.showFlux = false;
    this.showPost = false;
  }

}
