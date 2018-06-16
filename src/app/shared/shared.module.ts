import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {Ng2PageScrollModule} from 'ng2-page-scroll';

import { PostService } from './post.service';

import { HeaderComponent } from './header/header.component';
import { FluxBoxComponent } from './header/flux-box/flux-box.component';
import { OptionsBoxComponent } from './header/options-box/options-box.component';
import { PostBoxComponent } from './header/post-box/post-box.component';
import { SearchBoxComponent } from './header/search-box/search-box.component';
import { EmojisComponent } from './emojis/emojis.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FluxBoxComponent,
    OptionsBoxComponent,
    PostBoxComponent,
    SearchBoxComponent,
    EmojisComponent,
    FooterComponent
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    Ng2PageScrollModule,
    BrowserAnimationsModule,
    HeaderComponent,
    FooterComponent,
    EmojisComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    Ng2PageScrollModule,
    BrowserAnimationsModule
  ],
  providers: [
    PostService
  ]
})
export class SharedModule { }
