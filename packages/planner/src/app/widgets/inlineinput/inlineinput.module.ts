import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AlmEditableModule } from 'ngx-widgets';
import { AutosizeDirective } from './../autosize/autosize.directive';
import { ClickOutModule } from './../clickout/clickout.module';
import { InlineInputComponent } from './inlineinput.component';

@NgModule({
  declarations: [InlineInputComponent, AutosizeDirective],
  imports: [AlmEditableModule, ClickOutModule, CommonModule, FormsModule],
  exports: [InlineInputComponent],
})
export class InlineInputModule {}
