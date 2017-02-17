import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ReadmeComponent }     from './readme.component';
import { ReadmeRoutingModule } from './readme-routing.module';

@NgModule({
  imports:      [ CommonModule, ReadmeRoutingModule, HttpModule ],
  declarations: [ ReadmeComponent ],
})
export class ReadmeModule {
  constructor(http: Http) {}
}