import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { MomentModule } from 'angular2-moment';

import { WorkspacesItemDetailsComponent } from './workspaces-item-details.component';

@NgModule({
  imports: [
    CommonModule,
    MomentModule
  ],
  declarations: [ WorkspacesItemDetailsComponent ],
  exports: [ WorkspacesItemDetailsComponent ],
  providers: [ ]
})
export class WorkspacesItemDetailsModule {
  constructor(http: Http) { }
}
