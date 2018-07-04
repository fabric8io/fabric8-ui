import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { PlannerModule } from 'fabric8-planner';


@NgModule({
  imports:      [ CommonModule, PlannerModule ]
})
export class PlanModule {
  constructor(http: Http) {}
}
