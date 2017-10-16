import {Component, OnInit, Input} from '@angular/core';
import { Input as GuiInput } from '../../gui.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'review-step',
  templateUrl: './review-step.component.html'
})
export class ReviewStepComponent implements OnInit {

  @Input() gui: GuiInput;

  constructor() {}

  ngOnInit(): void {
    console.log(`::::ReviewStepComponent ngOnInit: ${JSON.stringify(this.gui)}`);
  }

}
