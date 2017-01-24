import { module } from '@angular/upgrade/src/angular_js';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { CodebasesComponent }     from './codebases.component';
import { CodebasesRoutingModule } from './codebases-routing.module';

@NgModule({
  imports:      [ CommonModule, CodebasesRoutingModule, HttpModule ],
  declarations: [ CodebasesComponent ],
})
export class CodebasesModule {
  constructor(http: Http) {}

}