import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Input as GuiInput } from 'ngx-forge';

@Component({
  selector: 'single-input',
  templateUrl: './single-input.component.html',
  styleUrls: ['./single-input.component.less']
})
export class SingleInputComponent implements OnInit {

  @Input() field: GuiInput;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() {
    if (!this.field.enabled) {
      this.form.controls['jenkinsSpace'].disable();
    }
  }

}

