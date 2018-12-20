import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { PlannerHttpClientModule } from '../../shared/http-module/http.module';
import { AreaService } from './../../services/area.service';
import { CollaboratorService } from './../../services/collaborator.service';
import { IterationService } from './../../services/iteration.service';
import { LabelService } from './../../services/label.service';
import { WorkItemService } from './../../services/work-item.service';
import { GlobalSettings } from './../../shared/globals';
import { WorkItemDetailRoutingModule } from './work-item-detail-routing.module';
import { WorkItemDetailModule } from './work-item-detail.module';

let providers = [
  AreaService,
  WorkItemService,
  GlobalSettings,
  IterationService,
  LabelService,
  TooltipConfig,
  CollaboratorService,
];

@NgModule({
  imports: [
    WorkItemDetailRoutingModule,
    WorkItemDetailModule,
    TooltipModule,
    PlannerHttpClientModule,
  ],
  providers: providers,
})
export class WorkItemDetailExternalModule {}
