import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeveloperPollComponent } from './developer-poll.component';
import { DeveloperPollRoutingModule } from './developer-poll-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DeveloperPollRoutingModule,
    RouterModule
  ],
  declarations: [DeveloperPollComponent],
  exports: [DeveloperPollComponent],
})
export class DeveloperPollModule { }