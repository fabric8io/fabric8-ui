import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlmEditableDirective } from './almeditable.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [AlmEditableDirective],
  exports: [AlmEditableDirective],
})
export class AlmEditableModule {}
