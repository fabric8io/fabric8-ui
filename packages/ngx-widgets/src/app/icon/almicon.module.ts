import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlmIconDirective } from './almicon.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [AlmIconDirective],
  exports: [AlmIconDirective],
})
export class AlmIconModule {}
