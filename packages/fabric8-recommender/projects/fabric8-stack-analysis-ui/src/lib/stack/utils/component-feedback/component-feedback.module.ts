/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */

import { ComponentFeedbackComponent } from './component-feedback.component';
import { ToastNotificationModule } from '../../toast-notification/toast-notification.module';
import { ComponentFeedbackService } from './component-feedback.service';

@NgModule({
    imports: [
        CommonModule,
        ToastNotificationModule
    ],
    declarations: [
        ComponentFeedbackComponent
    ],
    providers: [ComponentFeedbackService],
    exports: [
        ComponentFeedbackComponent
    ]
})

export class ComponentFeedbackModule {}
