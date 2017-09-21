import {Component, OnInit, Input} from '@angular/core';
import { Gui } from '../../gui.model';
import { FormGroup } from '@angular/forms';

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
    this.gui.inputs[2].value = this.labelSpace;
    console.log(`::::PipelineComponent ngOnInit: ${JSON.stringify(this.gui)}`);
  }

}
