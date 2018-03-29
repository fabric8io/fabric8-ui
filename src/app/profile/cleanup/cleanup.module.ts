import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';

import { ModalModule } from 'ngx-modal';
import { ListModule } from 'patternfly-ng/list';

import { CleanupRoutingModule } from './cleanup-routing.module';
import { CleanupComponent } from './cleanup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ModalModule,
    ListModule,
    CleanupRoutingModule
  ],
  declarations: [ CleanupComponent ]
})
export class CleanupModule {
  constructor(http: Http) {}
}
