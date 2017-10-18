import {Component, OnInit, Input} from '@angular/core';
import { Gui, Input as GuiInput } from '../../gui.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'project-info-step',
  templateUrl: './project-info-step.component.html'
})
export class ProjectInfoStepComponent implements OnInit {

  @Input() gui: Gui;
  @Input() form: FormGroup;
  @Input() labelSpace: string;
  organisation: GuiInput;
  repoName: GuiInput;
  groupId: GuiInput;
  repoVersion: GuiInput;

  constructor() {}

  ngOnInit(): void {
    // Default value for the project name to space name
    this.form.controls.named.setValue(this.labelSpace.toLowerCase());
    if (this.gui.inputs && this.gui.inputs.length > 3) {
      this.organisation = this.gui.inputs[0];
      this.repoName = this.gui.inputs[1];
      this.groupId = this.gui.inputs[2];
      this.repoVersion = this.gui.inputs[3];
    } else {
      this.repoName = this.gui.inputs[0];
      this.groupId = this.gui.inputs[1];
      this.repoVersion = this.gui.inputs[2];
    }
    console.log(':::label' + this.labelSpace);
  }

}
