import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';

import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { RemainingCharsCountModule } from 'patternfly-ng/remaining-chars-count';

import { OwnerGuard } from '../../shared/owner-guard.service';
import { UpdateRoutingModule } from './update-routing.module';
import { UpdateComponent } from './update.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    JWBootstrapSwitchModule,
    RemainingCharsCountModule,
    UpdateRoutingModule
  ],
  declarations: [ UpdateComponent ],
  providers: [ OwnerGuard ]
})
export class UpdateModule {
  constructor(http: Http) {}
}
