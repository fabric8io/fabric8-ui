import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { StackDetailsComponent } from './stack-details.component';
import { ModalModule } from 'ngx-modal';

import { StackRecommendationModule } from '../stack-recommendation/stack-recommendation.module';
import { ContainerTogglerModule } from 'ngx-widgets';

import { RecommenderModule } from '../recommender/recommender.module';
import { StackComponentsModule } from '../stack-components/stack-components.module';
import { OverviewModule } from '../overview/overview.module';

@NgModule({
  imports: [CommonModule,
            ContainerTogglerModule,
            HttpModule,
            ModalModule,
            RecommenderModule,
            StackComponentsModule,
            OverviewModule,
            StackRecommendationModule],
  declarations: [ StackDetailsComponent ],
  exports: [ StackDetailsComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StackDetailsModule {
  constructor(http: Http) {}
}
