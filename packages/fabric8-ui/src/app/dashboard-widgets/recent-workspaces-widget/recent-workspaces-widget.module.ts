import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { WorkspacesService } from '../../space/create/codebases/services/workspaces.service';
import { LoadingWidgetModule } from '../loading-widget/loading-widget.module';
import { RecentWorkspacesWidgetComponent } from './recent-workspaces-widget.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoadingWidgetModule,
    TooltipModule.forRoot()
  ],
  declarations: [RecentWorkspacesWidgetComponent],
  exports: [RecentWorkspacesWidgetComponent],
  providers: [TooltipConfig, WorkspacesService]
})
export class RecentWorkspacesWidgetModule { }
