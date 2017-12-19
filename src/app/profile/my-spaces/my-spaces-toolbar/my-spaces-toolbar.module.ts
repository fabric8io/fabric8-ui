import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { ToolbarModule } from 'patternfly-ng';

import { MySpacesToolbarComponent } from './my-spaces-toolbar.component';
import { SpaceWizardModule } from '../../space/wizard/space-wizard.module';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    RouterModule,
    ToolbarModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    MySpacesToolbarComponent
  ],
  providers: [
    BsDropdownConfig,
    TooltipConfig
  ],
  exports: [MySpacesToolbarComponent]
})
export class MySpacesToolbarModule { }
