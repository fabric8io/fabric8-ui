import {Component, OnInit, Input} from '@angular/core';

import { Option, SubmittableInput, Gui } from '../../gui.model';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'organisation-step',
  templateUrl: './organisation-step.component.html',
  styleUrls: ['./organisation-step.component.less']
})
export class OrganisationComponent implements OnInit {

  @Input() gui: Gui;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit(): void {
    console.log("::::OrganisationComponent ngOnInit" + JSON.stringify(this.gui));
  }
}
