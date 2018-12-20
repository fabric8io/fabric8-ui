import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { WorkItemLinkQuery } from '../../models/link';
import { WorkItemLinkTypeQuery } from './../../models/link-type';
import { SpaceQuery } from './../../models/space';
import {
  GroupWorkItemLinks,
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName,
} from './../../pipes/work-item-link-filters.pipe';
import { NgLetModule } from './../../shared/ng-let';
import { CommonSelectorModule } from './../common-selector/common-selector.module';
import { TypeaheadSelectorModule } from './../typeahead-selector/typeahead-selector.module';
import { WorkItemLinkComponent } from './work-item-link.component';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule,
    RouterModule,
    CommonSelectorModule,
    TypeaheadSelectorModule,
    NgLetModule,
  ],
  declarations: [
    WorkItemLinkComponent,
    WorkItemLinkFilterByTypeName,
    WorkItemLinkTypeFilterByTypeName,
    GroupWorkItemLinks,
  ],
  exports: [WorkItemLinkComponent],
  providers: [BsDropdownConfig, WorkItemLinkTypeQuery, WorkItemLinkQuery, SpaceQuery],
})
export class WorkItemLinkModule {}
