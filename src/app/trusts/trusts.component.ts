import { Component, OnInit } from '@angular/core';

class Trust {
  name: string;
  description: string;
  specialDescription: string;
  reputation: number;
}

@Component({
  selector: 'app-trusts',
  templateUrl: 'trusts.component.html',
  styles: []
})
export class TrustsComponent implements OnInit {
  trusts: Trust[];
  constructor() { }

  ngOnInit() {
    this.trusts = [
      { name: 'Group1', description: 'blablablablablabla', specialDescription: 'owner saying something in this banner', reputation: 23 },
      { name: 'Group1', description: 'blablablablablabla', specialDescription: 'owner saying something in this banner', reputation: 23 },
      { name: 'Group1', description: 'blablablablablabla', specialDescription: 'owner saying something in this banner', reputation: 23 },
    ];
  }

}
