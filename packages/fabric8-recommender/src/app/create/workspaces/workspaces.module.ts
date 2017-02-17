import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { WorkspacesComponent }     from './workspaces.component';
import { WorkspacesRoutingModule } from './workspaces-routing.module';

@NgModule({
  imports:      [ CommonModule, WorkspacesRoutingModule, HttpModule ],
  declarations: [ WorkspacesComponent ],
})
export class WorkspacesModule {
  constructor(http: Http) {}
}