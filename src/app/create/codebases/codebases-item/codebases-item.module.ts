import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { CodebasesService } from '../services/codebases.service';
import { GitHubService } from "../services/github.service";
import { CodebasesItemComponent } from './codebases-item.component';
import { CodebasesItemWorkspacesModule } from '../codebases-item-workspaces/codebases-item-workspaces.module';

@NgModule({
  imports: [
    CodebasesItemWorkspacesModule,
    CommonModule,
    FormsModule,
    TooltipModule.forRoot()
  ],
  declarations: [ CodebasesItemComponent ],
  exports: [ CodebasesItemComponent ],
  providers: [CodebasesService, GitHubService, TooltipConfig]
})
export class CodebasesItemModule {
  constructor(http: Http) {}
}
