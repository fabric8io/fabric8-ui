import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListModule } from 'patternfly-ng';
import { FeatureOptInRoutingModule } from './feature-opt-in-routing.module';
import { FeatureOptInComponent } from './feature-opt-in.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    FeatureOptInRoutingModule,
    ListModule
  ],
  declarations: [FeatureOptInComponent],
  exports: [FeatureOptInComponent]
})
export class FeatureOptInModule { }
