import {Component, forwardRef, Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefaultValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Input as Field, Option} from '../../gui.model';

const PROJECTSELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProjectSelect),
  multi: true
};

@Component({
  selector: 'ob-project-select',
  providers: [PROJECTSELECT_VALUE_ACCESSOR],
  templateUrl: './project-select.component.html',
  styleUrls: ['./project-select.component.less']
})
export class ProjectSelect extends DefaultValueAccessor {
  @Input() input: Field;
  model: string;

  writeValue(value: any): void {
    if (value !== undefined) {
      this.model = value;
    }
  }

  className(option: Option) {
    let index = option.id.indexOf(' ');
    index = index === -1 ? option.id.indexOf('.') : index;
    return option.id.substr(0, index).replace(/\./, '-');
  }

  isSelected(option: Option): boolean {
    return this.model === option.id;
  }

  setSelected(option: Option) {
    this.model = option.id;
    this.onChange(this.model);
  }

}

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [ProjectSelect],
  declarations: [ProjectSelect]
})
export class ProjectSelectModule {
}
