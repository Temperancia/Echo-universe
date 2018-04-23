import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any = {};
  newPublicUser: any = {};
  newEminentUser: any = {};
  errors: any = {};
  userForm: FormGroup;
  feel: boolean;
  spotlight: boolean;
  know: boolean;
  motto: boolean;
  public: boolean;
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.public = true;
    this.userForm = new FormGroup({
      'email': new FormControl(this.user.email, [
        Validators.required
      ])
    });
  }

  get email() { return this.userForm.get('email'); }
  public login(pub: boolean) {
    let credentials = undefined;
    if (pub) {
      credentials = {
        'email': this.user.email,
        'password': this.user.password
      };
    }
    this.authenticationService.login(credentials)
      .subscribe(response => {
        const user = {
          'id': response.id,
          'token': response.token
        }
        if (response && response['success'] === true) {
          // login successful
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/']);
        } else {
          // login failed
          this.errors['login'] = 'Email or password is incorrect';
        }
      });
  }

  public subscribe(pub) {
    let user;
    if (pub) {
      user = this.newPublicUser;
      user['type'] = 'Public';
    } else {
      user = this.newEminentUser;
      user['type'] = 'Eminent';
    }
    this.authenticationService.subscribe(user)
    .subscribe(response => {
      const user = {
        'id': response.id,
        'token': response.token
      }
      if (response && response['success'] === true) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/']);
      } else {
        // server should not fail to create a user ?
      }
    });
  }
}
