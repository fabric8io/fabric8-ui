import {Component, OnInit, Input} from '@angular/core';
import { Input as GuiInput } from '../../gui.model';

@Component({
  selector: 'pipeline-step',
  templateUrl: './pipeline-step.component.html'
})
export class PipelineStepComponent implements OnInit {

  @Input() gui: GuiInput;
  constructor() {}

  ngOnInit(): void {
    console.log(`::::PipelineComponent ngOnInit: ${JSON.stringify(this.gui)}`);
  }

}
