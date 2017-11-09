import { Component, OnInit, Input } from '@angular/core';
import { Gui, Input as GuiInput } from 'ngx-forge';
import { FormGroup, Validators } from '@angular/forms';

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
    // Add validation to fit server side validation
    this.form.controls['named'].setValidators([Validators.pattern(/^[a-z][a-z0-9\-]*$/),
      Validators.minLength(2),
      Validators.maxLength(24)]);

    // Default value for the project name to space name
    this.form.controls['named'].setValue(this.getValidDefaultName(this.labelSpace));

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
  }

  private getValidDefaultName(projectName: string): string {
    let defaultName = projectName.toLowerCase();
    if (defaultName.length > 24) {
      defaultName = defaultName.substring(0, 23);
    }
    defaultName = defaultName.replace(/_/g, '');
    return defaultName;
  }

}
