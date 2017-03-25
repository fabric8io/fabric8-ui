
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { StackComponent } from './stack.component';
import { StackRoutingModule } from './stack-routing.module';

import { StackDetailsModule } from 'fabric8-stack-analysis-ui';

@NgModule({
  imports: [
    StackDetailsModule,
    CommonModule,
    StackRoutingModule,
    HttpModule
  ],
  declarations: [StackComponent],
})
export class StackModule {
  constructor(http: Http) { }
}
