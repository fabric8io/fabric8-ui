import {Component, OnInit, Input} from '@angular/core';
import { Gui } from '../../gui.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'build-config-step',
  templateUrl: './build-config-step.component.html'
})
export class BuildConfigStepComponent implements OnInit {

  @Input() gui: Gui;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit(): void {
    // Override outpu from Forge Server
    this.gui.inputs[0].enabled = false;
    let controls = this.form.controls;
    this.gui.inputs[0].required = true;
    this.gui.inputs[1].label = 'Trigger build';
    this.gui.inputs[2].label = 'Add continuous integration web hooks';
    console.log(`::::BuildConfigStepComponent ngOnInit: ${JSON.stringify(this.gui)}`);
  }

}
