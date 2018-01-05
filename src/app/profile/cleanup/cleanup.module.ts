import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { ModalModule } from 'ngx-modal';
import { ListModule } from 'patternfly-ng';
import { CleanupComponent } from './cleanup.component';
import { CleanupRoutingModule } from './cleanup-routing.module';

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
