import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';
import { PipelinesWidgetComponent } from './pipelines-widget.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoadingWidgetModule,
    RouterModule,
    MomentModule
  ],
  declarations: [PipelinesWidgetComponent],
  exports: [PipelinesWidgetComponent],
  providers: [PipelinesService]
})
export class PipelinesWidgetModule { }
