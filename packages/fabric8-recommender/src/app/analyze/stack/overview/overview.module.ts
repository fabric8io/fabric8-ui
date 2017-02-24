import { NgModule } from '@angular/core';
import { OverviewComponent } from './overview.component';
import { ChartComponent } from './chart-component';

@NgModule({
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
