import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StackRecommendationComponent } from './stack-recommendation.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StackRecommendationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [StackRecommendationComponent]
})

export class StackRecoModule { }
