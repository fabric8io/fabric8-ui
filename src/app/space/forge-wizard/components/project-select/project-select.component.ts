import {Component, DoCheck, forwardRef, Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
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
export class ProjectSelect implements DoCheck, ControlValueAccessor {
  @Input() input: Field;
  model: string;

  onModelChange: Function = (_: any) => {  };
  onModelTouched: Function = () => {  };

  writeValue(value: any): void {
    if (value !== undefined) {
      this.model = value;
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  ngDoCheck() {
  }

  className(option: Option) {
    let index = option.id.indexOf(' ');
    index = index === -1 ? option.id.indexOf('.') : index;
    return option.id.substr(0, index);
  }

  isSelected(option: Option): boolean {
    return this.model === option.id;
  }

  setSelected(option: Option) {
    this.model = option.id;
    this.onModelChange(this.model);
  }

}

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [ProjectSelect],
  declarations: [ProjectSelect]
})
export class ProjectSelectModule {
}
