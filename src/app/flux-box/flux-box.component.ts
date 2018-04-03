import { Component, OnInit } from '@angular/core';
import {PostService} from '../post.service';

@Component({
  selector: 'app-flux-box',
  templateUrl: 'flux-box.component.html',
  styleUrls: ['flux-box.component.scss']
})
export class FluxBoxComponent implements OnInit {

  constructor(public postService: PostService) { }

  ngOnInit() {
  }
  public showTrendingFlux(): void {
    this.postService.displayedFluxes.trending = !this.postService.displayedFluxes.trending;
  }
  public showFriendsFlux(): void {
    this.postService.displayedFluxes.friends = !this.postService.displayedFluxes.friends;
  }
  public showDailyFlux(): void {
    this.postService.displayedFluxes.daily = !this.postService.displayedFluxes.daily;
  }
  public showStyleFlux(): void {
    this.postService.displayedFluxes.style = !this.postService.displayedFluxes.style;
  }
}
