import {Component, OnInit, Input} from '@angular/core';
import { Gui } from '../../gui.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'project-info-step',
  templateUrl: './project-info-step.component.html'
})
export class ProjectInfoStepComponent implements OnInit {

  @Input() gui: Gui;
  @Input() form: FormGroup;
  @Input() labelSpace: string;

  constructor() {}

  ngOnInit(): void {
    // Default value for the project name to space name
    this.form.controls.named.setValue(this.labelSpace.toLowerCase());
  }

}
