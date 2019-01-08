import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDropdownConfig, BsDropdownModule, TooltipConfig, TooltipModule } from 'ngx-bootstrap';
import { EmptyStateModule } from 'patternfly-ng/empty-state';
import { NgxDatatableModule } from 'rh-ngx-datatable';
import { SpaceQuery } from '../../models/space';
import { WorkItemQuery } from '../../models/work-item';
import { FilterColumnModule } from '../../pipes/column-filter.module';
import { CookieService } from '../../services/cookie.service';
import { FilterService } from '../../services/filter.service';
import { InlineInputModule } from '../../widgets/inlineinput/inlineinput.module';
import { PlannerModalModule } from '../../widgets/modal/modal.module';
import { WorkItemCellModule } from '../work-item-cell/work-item-cell.module';
import { WorkItemPreviewPanelModule } from '../work-item-preview-panel/work-item-preview-panel.module';
import { PlannerQueryRoutingModule } from './planner-query-routing.module';
import { PlannerQueryComponent } from './planner-query.component';

import { InfiniteScrollModule } from 'ngx-widgets';
import { ErrorHandler } from '../../effects/work-item-utils';
import { WorkItemTypeQuery } from '../../models/work-item-type';
import { QuerySuggestionService } from '../../services/query-suggestion.service';
import { UrlService } from '../../services/url.service';
import { NgLetModule } from '../../shared/ng-let';
import { ClickOutModule } from '../../widgets/clickout/clickout.module';
import { ListItemModule } from '../../widgets/list-item/list-item.module';
import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';
import { ExportCsvModule } from '../export-csv/export-csv.module';

@NgModule({
  imports: [
    BsDropdownModule,
    CommonModule,
    ClickOutModule,
    ExportCsvModule,
    FormsModule,
    FilterColumnModule,
    EmptyStateModule,
    InlineInputModule,
    PlannerQueryRoutingModule,
    NgxDatatableModule,
    TooltipModule,
    WorkItemCellModule,
    WorkItemPreviewPanelModule,
    WorkItemQuickAddModule,
    InfiniteScrollModule,
    NgLetModule,
    PlannerModalModule,
    ListItemModule,
  ],
  declarations: [PlannerQueryComponent],
  exports: [PlannerQueryComponent],
  providers: [
    BsDropdownConfig,
    SpaceQuery,
    CookieService,
    WorkItemQuery,
    FilterService,
    TooltipConfig,
    UrlService,
    WorkItemTypeQuery,
    ErrorHandler,
    QuerySuggestionService,
  ],
})
export class PlannerQueryModule {}
