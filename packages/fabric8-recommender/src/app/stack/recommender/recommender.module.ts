import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'ng2-bootstrap';

import { RecommenderComponent } from './recommender.component';

@NgModule({
    imports: [
        CommonModule,
        TooltipModule.forRoot()
    ],
    declarations: [RecommenderComponent],
    exports: [
        RecommenderComponent
    ]
})

export class RecommenderModule {}
