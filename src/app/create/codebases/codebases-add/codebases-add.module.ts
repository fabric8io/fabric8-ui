import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { CodebasesAddRoutingModule } from './codebases-add-routing.module';
import { CodebasesService } from './../services/codebases.service';
import { SlideOutPanelModule } from 'ngx-widgets';
import { GitHubService } from '../services/github.service';
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
