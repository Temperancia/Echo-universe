import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
    BrowserModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    PostService
  ]
})
export class SharedModule { }
