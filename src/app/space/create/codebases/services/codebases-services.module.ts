import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { CheService } from './che.service';
import { CodebasesService } from './codebases.service';
import { GitHubService } from './github.service';
import { WorkspacesService } from './workspaces.service';

@NgModule({
  imports: [ HttpModule ],
  providers: [
    CheService,
    CodebasesService,
    GitHubService,
    WorkspacesService
  ]
})
export class CodebasesServicesModule {}
