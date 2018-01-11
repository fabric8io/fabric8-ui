/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */

import { ComponentFeedbackComponent } from './component-feedback.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ComponentFeedbackComponent
    ],
    exports: [
        ComponentFeedbackComponent
    ]
})

export class ComponentFeedbackModule {}
