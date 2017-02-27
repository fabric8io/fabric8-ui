import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StackComponents } from './stack-components.component';
import { TableFilter } from './table-filter.pipe';
import { TableOrderByPipe } from './table-orderby.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [
        StackComponents,
        TableFilter,
        TableOrderByPipe
    ],
    exports: [
        StackComponents,
        TableFilter,
        TableOrderByPipe
    ]
})

export class StackComponentsModule {}
