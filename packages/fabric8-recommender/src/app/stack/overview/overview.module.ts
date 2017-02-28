import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewComponent } from './overview.component';
import { ChartComponent } from './chart-component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        OverviewComponent,
        ChartComponent
    ],
    exports: [
        OverviewComponent,
        ChartComponent
    ]
})
export class OverviewModule {}
