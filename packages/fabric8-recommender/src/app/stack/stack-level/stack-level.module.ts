import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { PopoverModule } from 'ngx-bootstrap';

import {StackLevelComponent} from './stack-level.component';
import {ChartModule} from '../utils/chart/chart.module';

import {TriggerFilterComponent} from '../utils/trigger-filter/trigger-filter.component';

@NgModule({
    imports: [
        CommonModule,
        PopoverModule.forRoot(),
        ChartModule
    ],
    declarations: [
        StackLevelComponent,
        TriggerFilterComponent
    ],
    exports: [
        StackLevelComponent
    ]
})

export class StackLevelModule {

}
