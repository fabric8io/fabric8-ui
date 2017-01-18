import { TeamMembershipDialogModule } from './../../team-membership-dialog/team-membership-dialog.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { ModalModule } from 'ng2-modal';
import { FormsModule } from '@angular/forms';


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
  declarations: [AnalyzeOverviewComponent],
})
export class AnalyzeOverviewModule {
  constructor(http: Http) { }
}
