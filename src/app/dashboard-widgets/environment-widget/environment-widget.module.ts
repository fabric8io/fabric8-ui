import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';

import { EnvironmentWidgetComponent } from './environment-widget.component';


@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, MomentModule ],
  declarations: [EnvironmentWidgetComponent],
  exports: [EnvironmentWidgetComponent]
})
export class EnvironmentWidgetModule { }
