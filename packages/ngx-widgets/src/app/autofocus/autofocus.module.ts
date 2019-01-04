import { NgModule } from '@angular/core';
import { AutofocusDirective } from './autofocus.directive';

@NgModule({
  declarations: [AutofocusDirective],
  exports: [AutofocusDirective],
})
export class AutofocusModule {}
