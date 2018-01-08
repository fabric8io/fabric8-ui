import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { PlannerDetailModule } from 'fabric8-planner';


@NgModule({
  imports:      [ CommonModule, PlannerDetailModule ]
})
export class DetailModule {
  constructor(http: Http) {}
}
