/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */

import { ComponentFeedbackComponent } from './component-feedback.component';
import { ToastNotificationModule } from '../../toast-notification/toast-notification.module';

@NgModule({
    imports: [
        CommonModule,
        ToastNotificationModule
    ],
    declarations: [
        ComponentFeedbackComponent
    ],
    exports: [
        ComponentFeedbackComponent
    ]
})

export class ComponentFeedbackModule {}
