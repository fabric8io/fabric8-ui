import { Component, OnInit, Input } from '@angular/core';
import { Gui } from 'ngx-forge';
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
    // Override output from Forge Server
    this.gui.inputs[0].enabled = false;
    this.gui.inputs[0].required = true;
    this.gui.inputs[1].label = 'Trigger build';
    this.gui.inputs[2].label = 'Add continuous integration web hooks';
  }

}
