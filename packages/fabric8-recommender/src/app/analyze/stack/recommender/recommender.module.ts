import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecommenderComponent } from './recommender.component';

@NgModule({
    imports: [CommonModule],
    declarations: [RecommenderComponent],
    exports: [RecommenderComponent]
})

export class RecommenderModule {}
