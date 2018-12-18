import { NgModule } from '@angular/core';
import { ClickOutDirective } from './clickout.directive';

@NgModule({
  declarations: [ClickOutDirective],
  exports: [ClickOutDirective],
})
export class ClickOutModule {}
