import {Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Gui } from '../../gui.model';

@Component({
  selector: 'organisation-step',
  templateUrl: './organisation-step.component.html',
  styleUrls: ['./organisation-step.component.less']
})
export class OrganisationComponent {

  @Input() gui: Gui;
  @Input() form: FormGroup;

  constructor() {}
}
