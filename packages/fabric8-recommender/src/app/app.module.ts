import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';

import { StackDetailsModule } from './stack/stack-details/stack-details.module';

@NgModule({
  imports:      [ BrowserModule, StackDetailsModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
