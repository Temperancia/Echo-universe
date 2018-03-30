import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ng2EmojiModule } from 'ng2-emoji';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
//import {TransferHttpCacheModule} from '@nguniversal/common';
import { FindHelpComponent } from './find-help/find-help.component';
import { FeedComponent } from './feed/feed.component';
import { FooterComponent } from './footer/footer.component';
import { EmojisComponent } from './emojis/emojis.component';
import { PostBoxComponent } from './post-box/post-box.component';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { PostService } from './post.service';
import { FriendService } from './friend.service';
import { TrustsComponent } from './trusts/trusts.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AboutComponent,
    MyProfileComponent,
    FindHelpComponent,
    FeedComponent,
    FooterComponent,
    EmojisComponent,
    PostBoxComponent,
    LoginComponent,
    TrustsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    routing,
    FormsModule,
    //TransferHttpCacheModule,
    Ng2EmojiModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    PostService,
    FriendService,


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
