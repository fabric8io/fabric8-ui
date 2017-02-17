import { StackDetailsModule } from './stack-details/stack-details.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { StackComponent } from './stack.component';
import { StackRoutingModule } from './stack-routing.module';

import { StackOverviewModule } from './stack-overview/stack-overview.module';

@NgModule({
  imports: [
    StackOverviewModule,
    CommonModule,
    StackRoutingModule,
    HttpModule
  ],
  declarations: [StackComponent],
})
export class StackModule {
  constructor(http: Http) { }
}
