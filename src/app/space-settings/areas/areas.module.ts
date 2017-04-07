import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { DropdownModule } from 'ng2-bootstrap';
import { ListViewModule } from 'ngx-widgets';

import { AreasComponent }     from './areas.component';
import { AreasRoutingModule } from './areas-routing.module';

@NgModule({
  imports:      [ CommonModule, AreasRoutingModule, HttpModule, ListViewModule, DropdownModule  ],
  declarations: [ AreasComponent ],
})
export class AreasModule {
  constructor(http: Http) {}
}
