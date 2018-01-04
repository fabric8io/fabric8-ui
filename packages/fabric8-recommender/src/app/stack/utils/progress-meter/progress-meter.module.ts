/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */

import { ProgressMeterComponent } from './progress-meter.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ProgressMeterComponent
    ],
    exports: [
        ProgressMeterComponent
    ]
})

export class ProgressMeterModule {}
