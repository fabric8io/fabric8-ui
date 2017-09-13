import { Component, Input, OnInit } from '@angular/core';
import { Input as GuiInput, Option } from 'app/space/forge-wizard/gui.model';

@Component({
  selector: 'single-input',
  templateUrl: './single-input.component.html'
})
export class SingleInputComponent implements OnInit {

  @Input() field: GuiInput

  constructor() {}

  ngOnInit() {}

}

