import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-inlineinput',
  templateUrl: './inlineinput.component.html',
  styleUrls: ['./inlineinput.component.less'],
})
export class InlineInputComponent implements OnInit {
  @ViewChild('input') inputField: ElementRef;

  @Input('type') type: string = 'string';
  @Input('disabled') disabled: boolean = false;
  @Input('value') set input(val) {
    // convert special charecters only the input value is a string
    const v = typeof val === 'string' ? this.convertSpecialChar(val) : val;
    this.inputValue = v;
    this.previousValue = v;
  }
  @Input() placeholder: string = 'Enter text here';
  @Input() allowOnLineClickEdit: boolean = true;

  @Output() readonly onSave = new EventEmitter();

  private inputValue: string = '';
  private saving: boolean = false;
  private editing: boolean = false;
  private previousValue: string = '';
  private errorMessage: string = '';
  private isNotValid: boolean;

  ngOnInit() {}

  startEditing(onLineClick: boolean) {
    this.errorMessage = '';
    if (this.disabled) {
      return;
    }
    // If field was clicked and onLineClick edit is allowed
    // Or startEditing was called from the edit icon click
    if ((onLineClick && this.allowOnLineClickEdit) || !onLineClick) {
      // If the editing is started
      if (!this.editing) {
        // Set previous value as the value in the field
        this.previousValue = this.inputField.nativeElement.value;
        // Set editing value as true
        this.editing = true;
      }
      this.inputField.nativeElement.focus();
    } else {
      this.inputField.nativeElement.blur();
    }
  }

  saveClick() {
    this.errorMessage = '';
    if (this.validateValue(this.inputField.nativeElement.value)) {
      this.saving = true;
      this.onSave.emit({
        value: this.formatValue(this.inputField.nativeElement.value),
        callBack: (v: string = '', e: string = '') => this.handleSave(v, e),
      });
    } else {
      this.errorMessage = `Invalid value for the field type ${this.type}`;
      this.inputField.nativeElement.focus();
    }
  }

  formatValue(value) {
    if (this.type === 'integer' || this.type === 'float') {
      return parseFloat(value);
    } else {
      return value;
    }
  }

  isFloat(val) {
    let x = parseFloat(val);
    return typeof x === 'number' && Number.isFinite(x) && x >= -2147483648 && x <= 2147483648;
  }

  validateValue(value) {
    if (this.type === 'integer') {
      return /^\d+$/.test(value);
    }
    if (this.type === 'float') {
      return this.isFloat(value);
    }
    return true;
  }

  closeClick() {
    if (this.editing) {
      this.errorMessage = '';
      this.inputValue = this.previousValue;
      this.inputField.nativeElement.value = this.previousValue;
      this.previousValue = '';
      this.editing = false;
    }
  }

  handleSave(value: string, error: string) {
    this.errorMessage = error;
    this.saving = false;
    if (this.errorMessage) {
    } else {
      this.editing = false;
      this.inputValue = value;
    }
  }

  convertSpecialChar(str: string) {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&#34;/g, '"')
      .replace(/&#39;/g, "'");
  }

  submitOnEnter(event) {
    event.preventDefault();
    this.saveClick();
    this.inputField.nativeElement.blur();
  }

  onkeyDown(event, text) {
    let keycode = event.keyCode ? event.keyCode : event.which;
    this.errorMessage = '';
    if (this.editing && keycode !== 13) {
      // Checking if there is already a '.' in float value
      if (
        this.type === 'float' &&
        this.inputField.nativeElement.value.indexOf('.') > -1 &&
        keycode === 190
      ) {
        event.preventDefault();
        return;
      }
      switch (this.type) {
        case 'integer':
          if (this.checkNumber(keycode, event)) {
            this.isNotValid = false;
          } else {
            this.isNotValid = true;
            event.preventDefault();
          }
          break;
        case 'float':
          if (this.checkNumber(keycode, event, true) || keycode === 190) {
            this.isNotValid = false;
          } else {
            this.isNotValid = true;
            event.preventDefault();
          }
          break;
        case 'string':
          this.isNotValid = false;
          break;
        default:
          break;
      }
    }
    if (this.editing && this.type == 'float' && keycode == 13) {
      this.saveClick();
    }
    if (this.isNotValid) {
      this.errorMessage = `This is a ${this.type} field`;
    }
  }

  /**
   * This function checks every key entry if it's a number or not
   * @param keycode
   * @param event
   * @param allowFloat allows the charecter key to be a '.'
   */
  checkNumber(keycode, event, allowFloat = false) {
    console.log(keycode, event);
    let allowedCodes = [46, 8, 9, 27, 13, 110, 91, 17];
    if (allowFloat) {
      allowedCodes = [...allowedCodes, 190];
    }
    if (
      allowedCodes.indexOf(keycode) !== -1 ||
      // Allow: Ctrl+A
      (keycode === 65 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+C
      (keycode === 67 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+V
      (keycode === 86 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+X
      (keycode === 88 && (event.ctrlKey || event.metaKey)) ||
      // Allow: home, end, left, right
      (keycode >= 48 && keycode <= 57)
    ) {
      // let it happen, is valid: true
      return true;
    }
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (keycode < 48 || keycode > 57)) && (keycode < 96 || keycode > 105)) {
      return false;
    }
  }
}
