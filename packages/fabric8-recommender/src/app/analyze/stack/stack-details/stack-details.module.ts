import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { DataTableModule } from 'angular2-datatable';

import { StackDetailsComponent } from './stack-details.component';
import { ModalModule } from 'ngx-modal';

import { StackRecommendationModule } from '../stack-recommendation/stack-recommendation.module';
import { ContainerTogglerModule } from 'ngx-widgets';

import { RecommenderModule } from '../recommender/recommender.module';

@NgModule({
  imports: [CommonModule,
            ContainerTogglerModule,
            DataTableModule,
            HttpModule,
            ModalModule,
            RecommenderModule,
            StackRecommendationModule],
  declarations: [ StackDetailsComponent ],
  exports: [ StackDetailsComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StackDetailsModule {
  constructor(http: Http) {}
}
