import { Component, OnInit } from '@angular/core';
import {PostService} from '../post.service';
import { Flux } from '../flux.enum';
import { AppSettings } from '../app.settings';

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
  displayedFluxes = AppSettings.displayedFluxes;
  constructor(private postService: PostService) { }

  ngOnInit() {
  }
  public toggleFlux(flux: Flux): void {
    this.displayedFluxes[flux] = !this.displayedFluxes[flux];
    this.postService.updateFeed(this.displayedFluxes);
    console.log(this.displayedFluxes)
  }
}
