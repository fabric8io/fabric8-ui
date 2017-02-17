import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { CreateComponent }     from './create.component';
import { CreateRoutingModule } from './create-routing.module';

import { CodebasesModule } from './codebases/codebases.module';


@NgModule({
  imports:      [ CodebasesModule, CommonModule, CreateRoutingModule, HttpModule ],
  declarations: [ CreateComponent ],
})
export class CreateModule {
  constructor(http: Http) {}
}