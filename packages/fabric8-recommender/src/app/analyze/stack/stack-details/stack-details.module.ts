import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { DataTableModule } from 'angular2-datatable';

import { StackDetailsComponent } from './stack-details.component';
import { ModalModule } from 'ngx-modal';

import { StackRecommendationModule } from '../stack-recommendation/stack-recommendation.module';
import { ContainerTogglerModule } from 'ngx-widgets';

@NgModule({
  imports: [CommonModule,
            ContainerTogglerModule,
            DataTableModule,
            HttpModule,
            ModalModule,
            StackRecommendationModule],
  declarations: [ StackDetailsComponent ],
  exports: [ StackDetailsComponent ]
})
export class StackDetailsModule {
  constructor(http: Http) {}
}
