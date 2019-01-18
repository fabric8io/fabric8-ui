import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ContainerTogglerComponent } from './container-toggler.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ContainerTogglerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ContainerTogglerComponent],
})
export class ContainerTogglerModule {}
