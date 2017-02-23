import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StackComponents } from './stack-components.component';
import { TableFilter } from './table-filter.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [
        StackComponents,
        TableFilter
    ],
    exports: [
        StackComponents,
        TableFilter
    ]
})

export class StackComponentsModule {}
