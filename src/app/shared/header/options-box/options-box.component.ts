import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../authentication/authentication.service';
@Component({
  selector: 'app-options-box',
  templateUrl: 'options-box.component.html',
  styleUrls: ['options-box.component.scss']
})
export class OptionsBoxComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
  public router: Router) { }

  ngOnInit() {
  }
  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
