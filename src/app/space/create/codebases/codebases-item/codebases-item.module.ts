import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';

import { CodebasesItemWorkspacesModule } from '../codebases-item-workspaces/codebases-item-workspaces.module';
import { CodebasesService } from '../services/codebases.service';
import { GitHubService } from '../services/github.service';
import { CodebasesItemComponent } from './codebases-item.component';

@NgModule({
  imports: [
    CodebasesItemWorkspacesModule,
    CommonModule,
    FormsModule,
    JWBootstrapSwitchModule
  ],
  declarations: [ CodebasesItemComponent ],
  exports: [ CodebasesItemComponent ],
  providers: [CodebasesService, GitHubService]
})
export class CodebasesItemModule {
  constructor(http: Http) {}
}
