import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CodebasesItemWorkspacesModule } from '../../../space/create/codebases/codebases-item-workspaces/codebases-item-workspaces.module';

import { CodebaseItemComponent } from './codebase-item.component';

@NgModule({
  imports: [
    CommonModule,
    CodebasesItemWorkspacesModule
  ],
  declarations: [ CodebaseItemComponent ],
  exports: [ CodebaseItemComponent ]
})
export class CodebaseItemModule { }
