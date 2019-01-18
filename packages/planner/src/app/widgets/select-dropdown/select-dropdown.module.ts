import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClickOutModule } from '../clickout/clickout.module';
import { SelectDropdownComponent } from './select-dropdown.component';

@NgModule({
  declarations: [SelectDropdownComponent],
  imports: [CommonModule, ClickOutModule],
  exports: [SelectDropdownComponent],
})
export class SelectDropdownModule {}
