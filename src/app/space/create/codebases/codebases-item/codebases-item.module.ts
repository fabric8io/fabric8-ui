import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { CodebasesItemWorkspacesModule } from '../codebases-item-workspaces/codebases-item-workspaces.module';
import { CodebasesServicesModule } from '../services/codebases-services.module';
import { CodebasesItemComponent } from './codebases-item.component';

@NgModule({
  imports: [
    CodebasesServicesModule,
    CodebasesItemWorkspacesModule,
    CommonModule,
    FormsModule,
    JWBootstrapSwitchModule
  ],
  declarations: [ CodebasesItemComponent ],
  exports: [ CodebasesItemComponent ]
})
export class CodebasesItemModule {}
