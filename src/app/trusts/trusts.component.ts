import { Component, OnInit } from '@angular/core';
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
  constructor(private trustService: TrustService) {
  }
  ngOnInit() {
    this.getTrusts();
  }
  createTrust() {
    this.trustService.createTrust(this.newTrust);
  }
  getTrusts() {
    this.trustService.getTrusts()
    .subscribe(trusts => {
      this.trusts = trusts;
    });
  }
}
