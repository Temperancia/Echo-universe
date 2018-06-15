import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { FeedHomeComponent } from './feed-home/feed-home.component';

@NgModule({
  declarations: [
    FeedHomeComponent
  ],
  imports: [
    SharedModule
  ],

  exports: [
    FeedHomeComponent
  ]
})
export class FluxModule { }
