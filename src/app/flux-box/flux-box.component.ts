import { Component, OnInit } from '@angular/core';
import {PostService} from '../post.service';
import { Flux } from '../flux.enum';

@Component({
  selector: 'app-flux-box',
  templateUrl: 'flux-box.component.html',
  styleUrls: ['flux-box.component.scss']
})
export class FluxBoxComponent implements OnInit {
  tendance = Flux.Tendance;
  friends = Flux.Friends;
  dailyLife = Flux.DailyLife;
  lifeStyle = Flux.LifeStyle;
  displayedFluxes = {
    tendance: false,
    friends: false,
    dailyLife: false,
    lifeStyle: false
  };
  constructor(private postService: PostService) { }

  ngOnInit() {
  }
  public toggleFlux(flux: Flux): void {
    this.displayedFluxes[flux] = !this.displayedFluxes[flux];
    this.postService.updateFeed(this.displayedFluxes);
  }
}
