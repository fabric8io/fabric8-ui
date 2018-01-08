import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Gui } from 'ngx-forge';

@Component({
  selector: 'pipeline-quickstart-step',
  templateUrl: './pipeline-quickstart-step.component.html'
})
export class PipelineQuickstartStepComponent implements OnInit {

  @Input() gui: Gui;
  @Input() form: FormGroup;
  @Input() labelSpace: string;
  constructor() {}

  ngOnInit(): void {
    // When creating pipeline we need to "tag" them the space label in OSO
    // so that OSiO can filtered by space
    this.gui.inputs[2].value = this.labelSpace;
  }

}
