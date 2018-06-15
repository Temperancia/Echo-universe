import {NgModule} from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Ng2PageScrollModule} from 'ng2-page-scroll';

import { routing } from './core.routing';

import { SharedModule } from './../shared/shared.module';
import { AuthenticationModule } from './../authentication/authentication.module';
import { CoreComponent } from './core.component';

import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';
import { JwtInterceptor } from './jwt.interceptor';

@NgModule({
  declarations: [
    CoreComponent,
  ],
  imports: [
    routing,
    Ng2PageScrollModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthenticationModule
  ],
  providers: [
    AuthGuard,
    PublicGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
  ],
  bootstrap: [CoreComponent]
})
export class CoreModule { }
