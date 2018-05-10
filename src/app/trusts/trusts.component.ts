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
  createTrust() {
    this.trustService.createTrust(this.newTrust).subscribe(response => {
      if (response && response.success) {
        this.router.navigate(['/trust/' + this.newTrust.key]);
      }
    });
  }
  getTrusts() {
    this.trustService.getTrusts()
    .subscribe(response => {
      this.trusts = response.trusts;
    });
  }
  joinTrust(id: string, key: string) {
    this.trustService.joinTrust(id).subscribe(response => {
      if (response && response.success) {
        //this.router.navigate(['/trust/' + key]);
      }
    });
  }
}
