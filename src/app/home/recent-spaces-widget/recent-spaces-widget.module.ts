import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Fabric8WitModule } from 'ngx-fabric8-wit';

import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';

import { RecentSpacesWidget } from './recent-spaces-widget.component';

@NgModule({
  imports: [
    CommonModule,
    Fabric8WitModule,
    LoadingWidgetModule,
    RouterModule,
    TooltipModule
  ],
  exports: [ RecentSpacesWidget ],
  declarations: [ RecentSpacesWidget ]
})
export class RecentSpacesWidgetModule { }
