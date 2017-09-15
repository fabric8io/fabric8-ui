import { Component, Input, forwardRef } from '@angular/core';
import { Input as GuiInput, Option } from "app/space/forge-wizard/gui.model";
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'single-selection-dropdown',
  templateUrl: './single-selection-dropdown.component.html',
  styleUrls: [ './single-selection-dropdown.component.less' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SingleSelectionDropDownComponent),
      multi: true
    }
  ]
})
export class SingleSelectionDropDownComponent implements ControlValueAccessor {

  @Input() field: GuiInput;
  model: string;
  showDropdown: boolean = false;

  onModelChange: Function = (_: any) => {
  };

  onModelTouched: Function = () => {
  };

  constructor() {}

  writeValue(value: any): void {
    if (value !== undefined) {
      this.model = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  setSelected(option: Option) {
    this.model = option.id;
    this.onModelChange(this.model);
  }

  isSelected(option: Option): boolean {
    return this.model === option.id;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

}
