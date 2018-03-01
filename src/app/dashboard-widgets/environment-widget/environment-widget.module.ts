import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';

// import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';
import { EnvironmentWidgetComponent } from './environment-widget.component';


@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, MomentModule/*, FeatureFlagModule */],
  declarations: [EnvironmentWidgetComponent],
  exports: [EnvironmentWidgetComponent]
})
export class EnvironmentWidgetModule { }
