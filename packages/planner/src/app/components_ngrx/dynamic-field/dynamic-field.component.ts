import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';

import { Logger } from 'ngx-base';

import { IMyDateModel, IMyOptions } from 'mydatepicker';

import { WorkItemUI } from '../../models/work-item';
import { WorkItemService } from './../../services/work-item.service';

export class DynamicUpdateEvent {
  key: string;
  newValue: any;
  oldValue: any;
  field: any;
}

/*
 * NOTE: this control is not using the FormGroup "properly", like with
 * a formControlName as an Input(). This is due to some components having
 * problems with that (namely the Datepicker). We may want to revisit this
 * later.
 */

/*
 *  This class represents one single dynamic data field. It uses the
 *  Angular form facilities to create a form group and display the
 *  control. If new data types should be supported, add them to this
 *  component.
 */
@Component({
  selector: 'alm-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.less'],
})
export class DynamicFieldComponent implements OnInit {
  // pristine old value that is needed for the cancel operation.
  private oldValue = null;
  private fieldValue = null;

  private dropdownMenuItems: any[] = [];
  private dropdownSelectedItems: any[] = [];

  private loadingField: boolean = false;

  private markupCallBack: any = null;
  private showField: boolean = true;

  // this is the input for dynamic field key and value
  @Input('keyValueField') set fieldValueSetter(val) {
    this.fieldValue = cloneDeep(val);
    this.loadingField = false;
    // if it's an enum type
    // set the dropdown values
    // to support the dropdown
    if (this.fieldValue.field.type.kind === 'enum') {
      this.dropdownMenuItems = this.extractEnumKeyValues(this.fieldValue.field.type.values);

      this.dropdownSelectedItems = this.dropdownMenuItems.filter(
        (v) => v.key === this.fieldValue.value,
      );
    }

    // if it's an boolean type
    // set the dropdown values
    // to support the dropdown
    if (this.fieldValue.field.type.kind === 'boolean') {
      this.dropdownMenuItems = this.extractBooleanKeyValues();

      this.dropdownSelectedItems = this.dropdownMenuItems.filter(
        (v) => v.key === this.fieldValue.value,
      );
    }

    // if it's a markup type
    // make the call back on update
    // to support the markup value
    if (this.fieldValue.field.type.kind === 'markup') {
      if (this.fieldValue.value == null) {
        this.showField = false;
      } else if (this.markupCallBack != null) {
        this.markupCallBack(this.fieldValue.value.content, this.fieldValue.value.rendered);
        this.markupCallBack = null;
      }
    }

    this.oldValue = this.fieldValue.value;
  }

  // this is the type schema taken from the work item type.
  @Input() attributeDesc: any;

  private editAllow: boolean = true;
  @Input('editAllow') set editAllowSetter(val: boolean) {
    this.editAllow = val;
    this.datePickerOptions.componentDisabled = !this.editAllow;
  }

  // event when value is updated, emits new value as the event.
  @Output() readonly onUpdate = new EventEmitter();

  // the attribute key we're dealing with.
  attributeKey: string;

  selectedfield: string;

  // the date value of the control (the datepicker works with a different data type).
  dateValue: any;

  error: string;
  buttonsVisible: boolean = false;

  datePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    selectionTxtFontSize: '14px',
    openSelectorOnInputClick: true,
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: false,
  };

  constructor(protected logger: Logger, protected workItemService: WorkItemService) {}

  ngOnInit(): void {
    // // get the attribute key from the descriptor
    // this.attributeKey = this.attributeDesc.key;
    // // store the pristine value.
    // this.oldValue = this.form.value[this.attributeKey];
    // // if this is a datepicker, we need to convert the data type.
    // if (this.attributeDesc.type.kind === 'instant') {
    //   // the datepicker we use does not support calling functions from the model attribute.
    //   this.dateValue = this.toDateModel(this.form.value[this.attributeKey]);
    // }
    // // we don't need to listen for @Input changes to the work item, because the form will
    // // be re-created from the schema on every load of a work item in the parent detail view.
    // // BUT: if we want to use this component on other dialogs that may not be re-created,
    // // we might need to listen to changes using OnChanges().
  }

  isValid() {
    if (this.fieldValue.field.type.kind === 'enum') {
      return this.fieldValue.field.type.values.findIndex((v) => v === this.fieldValue.value) > -1;
    } else {
      return true;
    }
    // return this.form.controls[this.attributeKey].valid;
  }

  isButtonsVisible() {
    return this.buttonsVisible;
  }

  focusIn() {
    this.buttonsVisible = true;
  }

  extractEnumKeyValues(possibleOptions: string[]): any[] {
    return [
      ...possibleOptions.map((v) => {
        return {
          key: v,
          value: v,
        };
      }),
    ];
  }

  extractBooleanKeyValues(): any[] {
    let values = [
      {
        key: null,
        value: 'None',
      },
      {
        key: 'true',
        value: 'Yes',
      },
      {
        key: 'false',
        value: 'No',
      },
    ];
    return values;
  }

  onChangeDropdown(newOptions: any[]) {
    const newValue = newOptions.map((option) => option.key).join();
    const oldValue = this.oldValue;
    const field = this.fieldValue.field;
    const key = this.fieldValue.key;
    this.loadingField = true;
    this.onUpdate.emit({
      newValue,
      oldValue,
      field,
      key,
    });
  }

  onChangeMarkup(newMarkupValue: string) {
    // if (newMarkupValue)
    //   this.form.patchValue(this.toUpdateObject(this.attributeKey, newMarkupValue));
    // this.save();
  }

  onDateChanged(newDate: IMyDateModel) {
    const newValue = newDate.jsdate.toISOString();
    const oldValue = this.oldValue;
    const field = this.fieldValue.field;
    const key = this.fieldValue.key;
    this.loadingField = true;
    this.onUpdate.emit({
      newValue,
      oldValue,
      field,
      key,
    });
  }

  toDateModel(dateValue: string): any {
    if (!dateValue) {
      return undefined;
    } else {
      let date: Date = new Date(dateValue);
      let convertedDate = {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
      };
      return convertedDate;
    }
  }

  saveInputField(event) {
    this.loadingField = true;
    const newValue = event.value;
    const oldValue = this.oldValue;
    const field = this.fieldValue.field;
    const key = this.fieldValue.key;
    this.onUpdate.emit({
      newValue,
      oldValue,
      field,
      key,
    });
  }

  toUpdateObject(key: string, value: any): any {
    let object = {};
    object[key] = value;
    return object;
  }

  markupUpdate(event: any): void {
    this.markupCallBack = event.callBack;
    if (event.rawText === this.oldValue.content) {
      this.markupCallBack(this.oldValue.content, this.oldValue.rendered);
      this.markupCallBack = null;
    } else {
      const newValue = {
        content: event.rawText,
        markup: 'Markdown',
      };
      const oldValue = this.oldValue;
      const field = this.fieldValue.field;
      const key = this.fieldValue.key;
      this.onUpdate.emit({
        newValue,
        oldValue,
        field,
        key,
      });
    }
  }

  showPreview(event: any): void {
    const rawText = event.rawText;
    const callBack = event.callBack;
    this.workItemService.renderMarkDown(rawText).subscribe((renderedHtml) => {
      callBack(rawText, renderedHtml);
    });
  }

  cancel() {
    // setting the form value to the (old) data value and mark it as pristine
    // this.form.controls[this.attributeKey].patchValue(this.oldValue);
    // this.form.controls[this.attributeKey].markAsPristine();
  }
}
