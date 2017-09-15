import {Component, OnInit, Input} from '@angular/core';
import { Input as GuiInput } from '../../gui.model';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'build-config-step',
  templateUrl: './build-config-step.component.html'
})
export class BuildConfigStepComponent implements OnInit {

  @Input() gui: GuiInput;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit(): void {
    console.log(`::::BuildConfigStepComponent ngOnInit: ${JSON.stringify(this.gui)}`);
  }

}
