import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { DialogModule } from 'ngx-widgets';
import { ActionModule } from 'patternfly-ng';

import { MySpacesItemActionsComponent } from './my-spaces-item-actions.component';

@NgModule({
  imports: [
    ActionModule,
    BsDropdownModule.forRoot(),
    CommonModule,
    DialogModule,
    FormsModule,
    ModalModule,
    TooltipModule.forRoot()
  ],
  declarations: [ MySpacesItemActionsComponent ],
  exports: [ MySpacesItemActionsComponent ],
  providers: [ BsDropdownConfig, TooltipConfig ]
})
export class MySpacesItemActionsModule {
  constructor(http: Http) {}
}
