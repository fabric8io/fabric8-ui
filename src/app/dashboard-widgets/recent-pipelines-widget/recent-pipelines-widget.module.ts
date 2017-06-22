import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { RecentPipelinesWidgetComponent } from './recent-pipelines-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlmMomentTime, WidgetsModule } from 'ngx-widgets';


@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, MomentModule ],
  declarations: [RecentPipelinesWidgetComponent],
  exports: [RecentPipelinesWidgetComponent]
})
export class RecentPipelinesWidgetModule { }
