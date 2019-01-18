import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { NgModule } from '@angular/core';

import { PlannerDetailModule } from 'fabric8-planner';

@NgModule({
  imports: [CommonModule, PlannerDetailModule],
})
export class PlanDetailModule {
  constructor(http: Http) {}
}
