import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgArrayPipesModule } from 'angular-pipes';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { InfiniteScrollModule, WidgetsModule } from 'ngx-widgets';

import { SpacesComponent } from './spaces.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    Fabric8WitModule,
    FormsModule,
    InfiniteScrollModule,
    ModalModule.forRoot(),
    WidgetsModule,
    NgArrayPipesModule
  ],
  declarations: [SpacesComponent],
  exports: [SpacesComponent]
})
export class SpacesModule { }
