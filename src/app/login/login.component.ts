import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any = {};
  newUser: any = {};
  error = '';
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  public login() {
    this.authenticationService.login(this.user.username, this.user.password)
      .subscribe(result => {
        console.log(result);
        /*
        if (result === true) {
          // login successful
          this.router.navigate(['/']);
        } else {
          // login failed
          this.error = 'Username or password is incorrect';
        }
        */
      });
  }
  public subscribe() {
    this.authenticationService.subscribe(this.newUser.email, this.newUser.password)
    .subscribe(result => {
      console.log(result);
    });
  }

}
