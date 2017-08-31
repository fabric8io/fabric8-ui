import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TabsModule} from 'ngx-bootstrap';
import {ChartModule} from '../utils/chart/chart.module';
import {StackDetailsModule} from '../stack-details/stack-details.module';
import {StackReportInShortComponent} from './stack-report-inshort.component';

@NgModule({
    imports: [
        CommonModule,
        ChartModule,
        StackDetailsModule,
        TabsModule.forRoot()
    ],
    declarations: [StackReportInShortComponent],
    exports: [StackReportInShortComponent]
})

export class StackReportInShortModule {}
