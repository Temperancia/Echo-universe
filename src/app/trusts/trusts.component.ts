import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrustService } from '../trust.service';
import { Trust } from '../trust';

@Component({
  selector: 'app-trusts',
  templateUrl: 'trusts.component.html',
  styleUrls: ['trusts.component.scss']
})
export class TrustsComponent implements OnInit {
  newTrust: any = {};
  trusts: Trust[];
  constructor(private trustService: TrustService, private router: Router) {
  }
  ngOnInit() {
    this.getTrusts();
  }
  getTrusts() {
    this.trustService.getTrusts()
    .subscribe(response => {
      this.trusts = response.trusts;
    }, err => {
      console.log(err);
    });
  }
  createTrust() {
    this.trustService.createTrust(this.newTrust).subscribe(response => {
      this.router.navigate(['/trust/' + this.newTrust.key]);
    });
  }
  joinTrust(id: string, key: string) {
    console.log(key);
    this.trustService.joinTrust(id).subscribe(response => {
      //this.router.navigate(['/trust/' + key]);
    });
  }
}
