import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';

import { WorkComponent }     from './work.component';
import { WorkRoutingModule } from './work-routing.module';

@NgModule({
  imports:      [ CommonModule, WorkRoutingModule ],
  declarations: [ WorkComponent ]
})
export class WorkModule {
  constructor(http: Http) {}
}
