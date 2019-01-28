import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RequestOptions, XHRBackend } from '@angular/http';
import { NgxDatatableModule } from 'rh-ngx-datatable';
import { WorkItemCellModule } from './../work-item-cell/work-item-cell.module';
import { WorkItemPreviewPanelModule } from './../work-item-preview-panel/work-item-preview-panel.module';

import { PlannerListComponent } from './planner-list.component';

import { TruncateModule } from 'ng2-truncate';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { PlannerModalModule } from '../../widgets/modal/modal.module';
import { AreaService } from './../../services/area.service';
import { CollaboratorService } from './../../services/collaborator.service';
import { CustomQueryService } from './../../services/custom-query.service';
import { IterationService } from './../../services/iteration.service';
import { LabelService } from './../../services/label.service';
import { WorkItemService } from './../../services/work-item.service';
import { GlobalSettings } from './../../shared/globals';
import { PlannerHttpClientModule } from './../../shared/http-module/http.module';
import { PlannerLayoutModule } from './../../widgets/planner-layout/planner-layout.module';
import { PlannerListRoutingModule } from './../planner-list/planner-list-routing.module';
import { SidepanelModule } from './../side-panel/side-panel.module';
import { ToolbarPanelModule } from './../toolbar-panel/toolbar-panel.module';
import { WorkItemQuickAddModule } from './../work-item-quick-add/work-item-quick-add.module';

import { CookieService } from './../../services/cookie.service';
import { FilterService } from './../../services/filter.service';

import { AlmIconModule, WidgetsModule } from 'ngx-widgets';
import { EmptyStateModule } from 'patternfly-ng/empty-state';
import { InfotipService } from '../../services/infotip.service';
import { UrlService } from '../../services/url.service';
import { ClickOutModule } from '../../widgets/clickout/clickout.module';

// Data Querries
import { AreaQuery } from '../../models/area.model';
import { WorkItemTypeQuery } from '../../models/work-item-type';
import { CommentQuery } from './../../models/comment';
import { GroupTypeQuery } from './../../models/group-types.model';
import { IterationQuery } from './../../models/iteration.model';
import { LabelQuery } from './../../models/label.model';
import { SpaceQuery } from './../../models/space';
import { UserQuery } from './../../models/user';
import { WorkItemQuery } from './../../models/work-item';

import { ErrorHandler } from '../../effects/work-item-utils';
import { FilterColumnModule } from '../../pipes/column-filter.module';
import { TableConfigModule } from './../table-config/table-config.module';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { PermissionService } from 'ngx-login-client';

let providers = [
  WorkItemService,
  CustomQueryService,
  IterationService,
  TooltipConfig,
  GlobalSettings,
  LabelService,
  AreaService,
  CollaboratorService,
  FilterService,
  BsDropdownConfig,
  CookieService,
  UrlService,
  InfotipService,
  CommentQuery,
  UserQuery,
  LabelQuery,
  IterationQuery,
  WorkItemQuery,
  AreaQuery,
  SpaceQuery,
  GroupTypeQuery,
  WorkItemTypeQuery,
  SpaceQuery,
  ErrorHandler,
  PermissionService,
];

@NgModule({
  imports: [
    AlmIconModule,
    CommonModule,
    ClickOutModule,
    FilterColumnModule,
    PlannerHttpClientModule,
    PlannerListRoutingModule,
    PlannerLayoutModule,
    PlannerModalModule,
    EmptyStateModule,
    ToolbarPanelModule,
    TooltipModule.forRoot(),
    SidepanelModule,
    WorkItemQuickAddModule,
    BsDropdownModule.forRoot(),
    NgxDatatableModule,
    WorkItemPreviewPanelModule,
    WidgetsModule,
    TableConfigModule,
    TruncateModule,
    WorkItemCellModule,
    FeatureFlagModule,
  ],
  declarations: [PlannerListComponent],
  providers: providers,
  exports: [PlannerListComponent],
})
export class PlannerListModule {
  constructor() {}
}
