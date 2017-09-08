import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Input as GuiInput, Option } from "app/space/forge-wizard/gui.model";

@Component({
  selector: 'single-selection-dropdown',
  templateUrl: './single-selection-dropdown.component.html',
  styleUrls: [ './single-selection-dropdown.component.less' ]
})
export class SingleSelectionDropDownComponent implements OnInit, OnDestroy {

  @Input() field: GuiInput;
  constructor() {
    console.log("::::::::::::::Single-Selection-Dropdown field constructor"+JSON.stringify(this.field));
  }

  ngOnInit() {
    console.log("::::::::::::::Single-Selection-Dropdown field ngInit"+JSON.stringify(this.field));
    this.field.display = {open: false};
  }

  ngOnDestroy() {
  }

  display() {
    console.log(":::::SELECTED FIELD:::"+ this.field.value);
  }

}
