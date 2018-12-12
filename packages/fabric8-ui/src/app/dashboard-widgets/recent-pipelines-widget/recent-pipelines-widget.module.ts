import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { LoadingWidgetModule } from '../loading-widget/loading-widget.module';
import { RecentPipelinesWidgetComponent } from './recent-pipelines-widget.component';


@NgModule({
  imports: [CommonModule, FormsModule, LoadingWidgetModule, RouterModule, MomentModule, FeatureFlagModule ],
  declarations: [RecentPipelinesWidgetComponent],
  exports: [RecentPipelinesWidgetComponent]
})
export class RecentPipelinesWidgetModule { }
