import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InfiniteScrollModule, WidgetsModule } from 'ngx-widgets';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { ModalModule } from 'ngx-modal';
import { NgArrayPipesModule } from 'angular-pipes';

import { SpaceWizardModule } from '../../../space/space-wizard/space-wizard.module';
import { SpacesComponent } from './spaces.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    Fabric8WitModule,
    FormsModule,
    InfiniteScrollModule,
    ModalModule,
    WidgetsModule,
    NgArrayPipesModule,
    SpaceWizardModule
  ],
  declarations: [SpacesComponent],
  exports: [SpacesComponent],
})
export class SpacesModule { }
