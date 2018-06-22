// import './rxjs-extensions';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FABRIC8_TOGGLES_API_URL } from './shared/toggles-api-url';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    WelcomeComponent
  ],
  providers: [
    { provide: FABRIC8_TOGGLES_API_URL, useValue: 'https://toggles.api.prod-preview.openshift.io' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
