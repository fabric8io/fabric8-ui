import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Gui } from 'ngx-forge';

@Component({
  selector: 'pipeline-step',
  templateUrl: './pipeline-step.component.html'
})
export class PipelineStepComponent implements OnInit {

  @Input() gui: Gui;
  @Input() form: FormGroup;
  @Input() labelSpace: string;
  constructor() {}

  ngOnInit(): void {
    // When creating pipeline we need to "tag" them the space label in OSO
    // so that OSiO can filtered by space
    this.gui.inputs[2].value = this.labelSpace;
    // Forge endpoint returns an information on the jenkins overrides reposiroties
    // let's display it as a note
    this.gui.inputs[3].display = {note: this.gui.inputs[3].description};
  }

}
