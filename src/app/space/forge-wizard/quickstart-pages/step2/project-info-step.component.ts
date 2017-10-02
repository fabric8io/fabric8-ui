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

  constructor() {}

  ngOnInit(): void {
    console.log(`::::ProjectInfoStepComponent ngOnInit: ${JSON.stringify(this.gui)}`);
  }

}
