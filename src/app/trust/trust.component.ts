import { Component, OnInit } from '@angular/core';
import { TrustService } from '../trust.service';
import { Trust } from '../trust';

@Component({
  selector: 'app-trust',
  templateUrl: 'trust.component.html',
  styleUrls: ['trust.component.scss']
})
export class TrustComponent implements OnInit {
  trust: string = "A trust";
  constructor(private trustService: TrustService) {
  }
  ngOnInit() {
  }
}
