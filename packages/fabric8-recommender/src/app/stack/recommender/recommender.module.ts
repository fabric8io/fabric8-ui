import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'ng2-bootstrap';

import { RecommenderComponent } from './recommender.component';
import { ToastNotificationComponent } from
    '../../shared/toast-notification/toast-notification.component';

@NgModule({
    imports: [
        CommonModule,
        TooltipModule.forRoot()
    ],
    declarations: [RecommenderComponent, ToastNotificationComponent],
    exports: [
        RecommenderComponent
    ]
})

export class RecommenderModule { }
