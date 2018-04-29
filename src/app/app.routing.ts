import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CirclesComponent } from './circles/circles.component';
import { FindHelpComponent } from './find-help/find-help.component';
import { TrustsComponent } from './trusts/trusts.component';
import { TrustComponent } from './trust/trust.component';
import { AuthGuard } from './auth.guard';
import { PublicGuard } from './public.guard';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'my-profile', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'circles', component: CirclesComponent, canActivate: [AuthGuard] },
  { path: 'trusts', component: TrustsComponent, canActivate: [AuthGuard, PublicGuard] },
  { path: 'trust/:name', component: TrustComponent, canActivate: [AuthGuard, PublicGuard] },
  { path: 'help', component: FindHelpComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
