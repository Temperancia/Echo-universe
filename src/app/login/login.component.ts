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
  feel: boolean;
  spotlight: boolean;
  know: boolean;
  motto: boolean;
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  public login() {
    if (!this.user || !this.user.email || this.user.email === '' || !this.user.password || this.user.password === '') {
      this.error = 'Email or password is incorrect';
    } else {
      this.authenticationService.login(this.user.email, this.user.password)
        .subscribe(response => {
          let user = {
            'token': response.token
          }
          console.log(response);
          if (response && response['success'] === true) {
            // login successful
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.router.navigate(['/']);
          } else {
            // login failed
            this.error = 'Email or password is incorrect';
          }
        });
    }

  }
  public subscribe() {
    this.authenticationService.subscribe(this.newUser.email, this.newUser.password)
    .subscribe(result => {
      console.log(result);
    });
  }

}
