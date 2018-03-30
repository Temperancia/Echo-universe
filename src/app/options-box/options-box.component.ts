import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
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
