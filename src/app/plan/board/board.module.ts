import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { PlannerBoardModule } from 'fabric8-planner';

import { BoardComponent }     from './board.component';
import { BoardRoutingModule } from './board-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BoardRoutingModule,
    HttpModule,
    PlannerBoardModule
  ],
  declarations: [ BoardComponent ],
})
export class BoardModule {
  constructor(http: Http) {}
}