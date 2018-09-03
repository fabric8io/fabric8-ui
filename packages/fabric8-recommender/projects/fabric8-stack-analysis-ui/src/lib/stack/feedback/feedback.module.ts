import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {FeedbackComponent} from './feedback.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        FeedbackComponent
    ],
    exports: [
        FeedbackComponent
    ]
})

export class FeedbackModule {}
