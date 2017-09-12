import {Component, OnInit, Input} from '@angular/core';

import { Option, SubmittableInput, Input as GuiInput } from '../../gui.model';

@Component({
  selector: 'pipeline-step',
  templateUrl: './pipeline-step.component.html'
})
export class PipelineStepComponent implements OnInit {

  @Input() gui: GuiInput;
  constructor() {
    //console.log("::::PipelineComponent Constructor" + JSON.stringify(this.gui));
  }

  ngOnInit(): void {
    console.log("::::PipelineComponent ngOnInit gui.inputs[0]" + JSON.stringify(this.gui));
  }

}
