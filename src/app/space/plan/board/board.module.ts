import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { PlannerBoardModule } from 'fabric8-planner';

@NgModule({
  imports:      [ CommonModule, PlannerBoardModule ]
})
export class BoardModule {
  constructor(http: Http) {}
}
