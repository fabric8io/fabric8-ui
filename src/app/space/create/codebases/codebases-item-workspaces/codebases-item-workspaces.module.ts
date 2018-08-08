import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { CodebasesServicesModule } from '../services/codebases-services.module';
import { CodebasesItemWorkspacesComponent } from './codebases-item-workspaces.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CodebasesServicesModule,
    CommonModule,
    FormsModule,
    TooltipModule.forRoot()
  ],
  declarations: [ CodebasesItemWorkspacesComponent ],
  exports: [ CodebasesItemWorkspacesComponent ],
  providers: [ BsDropdownConfig, TooltipConfig ]
})
export class CodebasesItemWorkspacesModule {}
