import { TeamMembershipDialogModule } from './../../team-membership-dialog/team-membership-dialog.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { ModalModule } from 'ngx-modal';
import { FormsModule } from '@angular/forms';
// import { Broadcaster } from 'ngx-login-client';

import { AnalyzeOverviewComponent } from './analyze-overview.component';
import { AnalyzeOverviewRoutingModule } from './analyze-overview-routing.module';



@NgModule({
  imports: [
    CommonModule,
    AnalyzeOverviewRoutingModule,
    HttpModule,
    ModalModule,
    FormsModule,
    TeamMembershipDialogModule
  ],
  // providers: [Broadcaster],
  declarations: [AnalyzeOverviewComponent],
})
export class AnalyzeOverviewModule {
  constructor(http: Http) { }
}
