import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WidgetsModule } from 'ngx-widgets';
import { LabelService } from './../../services/label.service';
import { SelectDropdownModule } from './../../widgets/select-dropdown/select-dropdown.module';
import { LabelSelectorComponent } from './label-selector.component';

@NgModule({
  imports: [WidgetsModule, CommonModule, SelectDropdownModule],
  declarations: [LabelSelectorComponent],
  exports: [LabelSelectorComponent],
  providers: [LabelService],
})
export class LabelSelectorModule {}
