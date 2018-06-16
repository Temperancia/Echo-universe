import { Component, OnInit } from '@angular/core';
import { PostService } from './../../post.service';
import { Flux } from './../../../core/enums/flux.enum';
import { displayedFluxes } from './../../../core/core.settings';

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
  displayedFluxes = displayedFluxes;
  constructor(private postService: PostService) { }

  ngOnInit() {
  }
  public toggleFlux(flux: Flux): void {
    displayedFluxes[flux] = !displayedFluxes[flux];
    this.postService.updateFeed(displayedFluxes);
  }
}
