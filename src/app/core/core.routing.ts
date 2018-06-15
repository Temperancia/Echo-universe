import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './../authentication/login/login.component';
import { HomeComponent } from './../authentication/home/home.component';
/*
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CirclesComponent } from './circles/circles.component';
import { TrustsComponent } from './trusts/trusts.component';
import { TrustComponent } from './trust/trust.component';
import { NotificationsComponent } from './notifications/notifications.component';
*/
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  /*
  { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'circles', component: CirclesComponent, canActivate: [AuthGuard] },
  { path: 'trusts', component: TrustsComponent, canActivate: [AuthGuard, PublicGuard] },
  { path: 'trust/:name', component: TrustComponent, canActivate: [AuthGuard, PublicGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  */
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
