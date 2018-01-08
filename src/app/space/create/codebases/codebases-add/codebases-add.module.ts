import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { SlideOutPanelModule } from 'ngx-widgets';

import { CodebasesService } from '../services/codebases.service';
import { GitHubService } from '../services/github.service';
import { CodebasesAddRoutingModule } from './codebases-add-routing.module';
import { CodebasesAddComponent } from './codebases-add.component';

@NgModule({
  imports: [
    CodebasesAddRoutingModule,
    CommonModule,
    FormsModule,
    SlideOutPanelModule
  ],
  declarations: [CodebasesAddComponent],
  exports: [CodebasesAddComponent],
  providers: [GitHubService, CodebasesService]
})
export class CodebasesAddModule {
  constructor(http: Http) { }
}
