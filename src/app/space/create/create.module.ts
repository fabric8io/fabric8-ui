import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { CodebasesModule } from './codebases/codebases.module';
import { CreateRoutingModule } from './create-routing.module';
import { CreateComponent } from './create.component';

@NgModule({
  imports: [
    CodebasesModule,
    CommonModule,
    CreateRoutingModule
  ],
  declarations: [CreateComponent],
  providers: [

  ]
})
export class CreateModule {
  constructor(http: Http) { }
}
