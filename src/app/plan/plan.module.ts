import { PlannerListModule } from 'fabric8-planner';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';


@NgModule({
  imports:      [ CommonModule, PlannerListModule ]
})
export class PlanModule {
  constructor(http: Http) {}
}
