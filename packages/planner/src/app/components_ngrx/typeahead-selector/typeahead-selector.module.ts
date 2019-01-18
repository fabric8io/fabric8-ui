import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TruncateModule } from 'ng2-truncate';
import { WidgetsModule } from 'ngx-widgets';

import { NgLetModule } from '../../shared/ng-let';
import { SelectDropdownModule } from '../../widgets/select-dropdown/select-dropdown.module';
import { TypeaheadSelectorComponent } from './typeahead-selector.component';

@NgModule({
  imports: [CommonModule, SelectDropdownModule, TruncateModule, WidgetsModule, NgLetModule],
  declarations: [TypeaheadSelectorComponent],
  exports: [TypeaheadSelectorComponent],
})
export class TypeaheadSelectorModule {}
