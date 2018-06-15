import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { FluxModule } from './../flux/flux.module';

import { AuthenticationService } from './authentication.service';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent
  ],
  imports: [
    SharedModule,
    FluxModule
  ],
  providers: [
    AuthenticationService
  ]
})
export class AuthenticationModule { }
