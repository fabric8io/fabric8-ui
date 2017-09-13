import {Component, OnInit, Input} from '@angular/core';

import { Option, SubmittableInput, Input as GuiInput } from '../../gui.model';

@Component({
  selector: 'organisation-step',
  templateUrl: './organisation-step.component.html',
  styleUrls: ['./organisation-step.component.less']
})
export class OrganisationComponent implements OnInit {


  @Input() gui: GuiInput;
  constructor() {}

  ngOnInit(): void {
    // console.log("::::OrganisationComponent ngOnInit" + JSON.stringify(this.gui));
  }

}
