import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyDatePickerModule } from 'mydatepicker';
import { TruncateModule } from 'ng2-truncate';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { MarkdownModule, WidgetsModule } from 'ngx-widgets';
import { PlannerModalModule } from '../../widgets/modal/modal.module';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { UserMapper, UserQuery } from './../../models/user';
import { AlmUserNameModule } from './../../pipes/alm-user-name.module';
import { InlineInputModule } from './../../widgets/inlineinput/inlineinput.module';
import { AssigneeSelectorModule } from './../assignee-selector/assignee-selector.module';
import { AssigneesModule } from './../assignee/assignee.module';
import { CommonSelectorModule } from './../common-selector/common-selector.module';
import { LabelsModule } from './../labels/labels.module';
import { WorkItemCommentWrapperModule } from './../work-item-comment-wrapper/work-item-comment-wrapper.module';
import { WorkItemEventWrapperModule } from './../work-item-event-wrapper/work-item-event-wrapper.module';
import { WorkItemLinkModule } from './../work-item-link/work-item-link.module';
import { WorkItemDetailRoutingModule } from './work-item-detail-routing.module';
import { WorkItemDetailComponent } from './work-item-detail.component';

// ngrx stuff
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommentEffects } from './../../effects/comment.effects';
import { DetailWorkItemEffects } from './../../effects/detail-work-item.effects';
import { LinkTypeEffects } from './../../effects/link-type.effects';
import { WorkItemLinkEffects } from './../../effects/work-item-link.effects';
import { CommentReducer } from './../../reducers/comment.reducer';
import { DetailWorkItemReducer } from './../../reducers/detail-work-item.reducer';
import { LinkTypeReducer } from './../../reducers/link-type.reducer';
import { WorkItemLinkReducer } from './../../reducers/work-item-link.reducer';
import { initialState as initialCommentState } from './../../states/comment.state';
import { initialState as initialDetailWIState } from './../../states/detail-work-item.state';
import { initialState as initialEventState } from './../../states/event.state';
import { initialState as initialLinkTypeState } from './../../states/link-type.state';
import { initialState as initialWILinkState } from './../../states/work-item-link.state';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { EventEffects } from '../../effects/event.effects';
import { SafePipeModule } from '../../pipes/safe.module';
import { EventReducer } from '../../reducers/event.reducer';
import { UrlService } from '../../services/url.service';
import { LabelSelectorModule } from '../label-selector/label-selector.module';

import { ErrorHandler } from '../../effects/work-item-utils';
import { AreaQuery } from '../../models/area.model';
import { IterationQuery } from '../../models/iteration.model';
import { WorkItemTypeQuery } from '../../models/work-item-type';
import { DeleteWorkItemModule } from '../delete-work-item/delete-work-item.module';
import { CommentQuery } from './../../models/comment';
import { LabelQuery } from './../../models/label.model';
import { SpaceQuery } from './../../models/space';
import { WorkItemQuery } from './../../models/work-item';
import { ClickOutModule } from './../../widgets/clickout/clickout.module';
import { UserAvatarModule } from './../../widgets/user-avatar/user-avatar.module';

@NgModule({
  imports: [
    AlmUserNameModule,
    AssigneesModule,
    AssigneeSelectorModule,
    CommonModule,
    CommonSelectorModule,
    FormsModule,
    WidgetsModule,
    InlineInputModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    LabelsModule,
    LabelSelectorModule,
    MarkdownModule,
    MyDatePickerModule,
    WorkItemCommentWrapperModule,
    WorkItemEventWrapperModule,
    PlannerModalModule,
    TruncateModule,
    WorkItemLinkModule,
    ReactiveFormsModule,
    ClickOutModule,
    DeleteWorkItemModule,
    StoreModule.forFeature(
      'detailPage',
      {
        comments: CommentReducer,
        workItem: DetailWorkItemReducer,
        linkType: LinkTypeReducer,
        workItemLink: WorkItemLinkReducer,
        events: EventReducer,
      },
      {
        initialState: {
          events: initialEventState,
          comments: initialCommentState,
          workItem: initialDetailWIState,
          linkType: initialLinkTypeState,
          workItemLink: initialWILinkState,
        },
      },
    ),
    EffectsModule.forFeature([
      CommentEffects,
      DetailWorkItemEffects,
      EventEffects,
      LinkTypeEffects,
      WorkItemLinkEffects,
    ]),
    SafePipeModule,
    UserAvatarModule,
  ],
  providers: [
    CommentQuery,
    LabelQuery,
    UserQuery,
    UserMapper,
    UrlService,
    SpaceQuery,
    BsDropdownConfig,
    TooltipConfig,
    IterationQuery,
    WorkItemQuery,
    AreaQuery,
    WorkItemTypeQuery,
    ErrorHandler,
  ],
  declarations: [WorkItemDetailComponent, DynamicFieldComponent],
  exports: [WorkItemDetailComponent],
})
export class WorkItemDetailModule {}
