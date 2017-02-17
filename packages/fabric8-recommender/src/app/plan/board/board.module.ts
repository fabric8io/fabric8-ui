import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { BoardComponent }     from './board.component';
import { BoardRoutingModule } from './board-routing.module';

@NgModule({
  imports:      [ CommonModule, BoardRoutingModule, HttpModule ],
  declarations: [ BoardComponent ],
})
export class BoardModule {
  constructor(http: Http) {}
}