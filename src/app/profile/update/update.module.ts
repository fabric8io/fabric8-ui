import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';

import { RemainingCharsModule } from 'ngx-widgets';

import { UpdateComponent } from './update.component';
import { UpdateRoutingModule } from './update-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    JWBootstrapSwitchModule,
    RemainingCharsModule,
    UpdateRoutingModule
  ],
  declarations: [ UpdateComponent ],
})
export class UpdateModule {
  constructor(http: Http) {}
}
