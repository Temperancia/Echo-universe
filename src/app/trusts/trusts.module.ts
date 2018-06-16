import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';

import { TrustService } from './trust.service';

import { TrustComponent } from './trust/trust.component';
import { TrustsComponent } from './trusts/trusts.component';

@NgModule({
  declarations: [
    TrustComponent,
    TrustsComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [
    TrustService
  ]
})
export class TrustModule { }
