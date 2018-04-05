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
  newUser: any = {};
  errors: any = {};
  userForm: FormGroup;
  feel: boolean;
  spotlight: boolean;
  know: boolean;
  motto: boolean;
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.userForm = new FormGroup({
      'email': new FormControl(this.user.email, [
        Validators.required
      ])
    });
  }

  get email() { return this.userForm.get('email'); }
  public login() {
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
          this.errors['login'] = 'Email or password is incorrect';
        }
      });

  }
  public subscribe() {
    this.authenticationService.subscribe(this.newUser.email, this.newUser.password)
    .subscribe(result => {
      console.log(result);
    });
  }

}
