import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { CardModule } from 'patternfly-ng/card';
import { AssigneesModule } from '../assignee/assignee.module';
import { UserAvatarModule } from './../../widgets/user-avatar/user-avatar.module';
import { LabelsModule } from './../labels/labels.module';
import { PlannerCardComponent } from './planner-card.component';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    TooltipModule,
    UserAvatarModule,
    LabelsModule,
    AssigneesModule,
  ],
  declarations: [PlannerCardComponent],
  providers: [TooltipConfig],
  exports: [PlannerCardComponent],
})
export class PlannerCardModule {}
