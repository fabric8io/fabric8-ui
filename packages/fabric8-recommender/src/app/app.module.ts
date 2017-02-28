import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';

import { FabricStackAnalysisModule } from './stack/'

@NgModule({
  imports:      [ BrowserModule, FabricStackAnalysisModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
