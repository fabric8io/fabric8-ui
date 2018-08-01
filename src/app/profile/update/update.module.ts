import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { RemainingCharsCountModule } from 'patternfly-ng/remaining-chars-count';

import { OwnerGuard } from '../../shared/owner-guard.service';
import { UpdateRoutingModule } from './update-routing.module';
import { UpdateComponent } from './update.component';

import { SpacesModule } from '../overview/spaces/spaces.module';
import { WorkItemsModule } from '../overview/work-items/work-items.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    JWBootstrapSwitchModule,
    RemainingCharsCountModule,
    UpdateRoutingModule,
    SpacesModule,
    WorkItemsModule
  ],
  declarations: [ UpdateComponent ],
  providers: [ OwnerGuard ]
})
export class UpdateModule {}
