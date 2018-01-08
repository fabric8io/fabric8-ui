/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsModule } from 'ngx-bootstrap';
/** Vendor imports Go HERE */

import { ReportInformationModule } from './report-information/report-information.module';

import { CardDetailsComponent } from './card-details.component';

const imports = [
    ReportInformationModule,
    TabsModule.forRoot()
];

const declarations = [
    CardDetailsComponent
];

@NgModule({
    imports: [
        CommonModule,
        ...imports
    ],
    declarations: [
        ...declarations
    ],
    exports: [
        ...declarations
    ]
})
export class CardDetailsModule {}
