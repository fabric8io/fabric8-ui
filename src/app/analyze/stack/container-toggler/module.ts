import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerTogglerComponent } from './container-toggler.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ContainerTogglerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ContainerTogglerComponent]
})

export class ContainerTogglerModule { }
