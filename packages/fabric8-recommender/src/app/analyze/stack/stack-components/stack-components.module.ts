import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StackComponents } from './stack-components.component';

@NgModule({
    imports: [CommonModule],
    declarations: [StackComponents],
    exports: [StackComponents]
})

export class StackComponentsModule {}
