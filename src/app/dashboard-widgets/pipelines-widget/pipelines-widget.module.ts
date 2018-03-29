import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';

import { PipelinesWidgetComponent } from './pipelines-widget.component';

import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MomentModule,
    FeatureFlagModule
  ],
  declarations: [PipelinesWidgetComponent],
  exports: [PipelinesWidgetComponent]
})
export class PipelinesWidgetModule { }
