import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { GitHubService } from '../services/github.service';
import { CodebasesItemDetailsComponent } from './codebases-item-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ CodebasesItemDetailsComponent ],
  exports: [ CodebasesItemDetailsComponent ],
  providers: [GitHubService]
})
export class CodebasesItemDetailsModule {
  constructor(http: Http) {}
}
