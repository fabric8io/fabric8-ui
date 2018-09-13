import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CheService } from './che.service';
import { CodebasesService } from './codebases.service';
import { GitHubService } from './github.service';
import { WorkspacesService } from './workspaces.service';

@NgModule({
  imports: [ HttpClientModule ],
  providers: [
    CheService,
    CodebasesService,
    GitHubService,
    WorkspacesService
  ]
})
export class CodebasesServicesModule {}
