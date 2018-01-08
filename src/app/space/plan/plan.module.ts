import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { PlannerListModule } from 'fabric8-planner';


@NgModule({
  imports:      [ CommonModule, PlannerListModule ]
})
export class PlanModule {
  constructor(http: Http) {}
}
