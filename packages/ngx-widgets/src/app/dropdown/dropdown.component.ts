import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DropdownOption } from './dropdown-option';

@Component({
  selector: 'alm-dropdown',
  styleUrls: ['./dropdown.component.less'],
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent implements OnInit {
  @Input() options: DropdownOption[];

  @Input() selected: DropdownOption;

  @Input() disabled: Boolean;

  @Output('change') onUpdate = new EventEmitter();

  show: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  toggle(): void {
    this.show = !this.show;
  }

  open(): void {
    this.show = true;
  }

  close(): void {
    this.show = false;
  }

  onChange(option: DropdownOption): void {
    this.onUpdate.emit({
      currentOption: this.selected,
      newOption: option,
    });
    this.toggle();
  }
}
