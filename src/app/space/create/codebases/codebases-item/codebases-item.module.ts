import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JwBootstrapSwitchNg2Module } from 'jw-bootstrap-switch-ng2';

import { CodebasesItemWorkspacesModule } from '../codebases-item-workspaces/codebases-item-workspaces.module';
import { CodebasesServicesModule } from '../services/codebases-services.module';
import { CodebasesItemComponent } from './codebases-item.component';

@NgModule({
  imports: [
    CodebasesServicesModule,
    CodebasesItemWorkspacesModule,
    CommonModule,
    FormsModule,
    JwBootstrapSwitchNg2Module
  ],
  declarations: [ CodebasesItemComponent ],
  exports: [ CodebasesItemComponent ]
})
export class CodebasesItemModule {}
