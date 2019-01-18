import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { PipelinesService } from '../../space/create/pipelines/services/pipelines.service';
import { LoadingWidgetModule } from '../loading-widget/loading-widget.module';
import { PipelinesWidgetComponent } from './pipelines-widget.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoadingWidgetModule,
    RouterModule,
    MomentModule,
    TooltipModule.forRoot(),
  ],
  declarations: [PipelinesWidgetComponent],
  exports: [PipelinesWidgetComponent],
  providers: [PipelinesService, TooltipConfig],
})
export class PipelinesWidgetModule {}
