import {Component, OnInit, Input} from '@angular/core';

import { Gui } from '../../gui.model';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'repositories-step',
  templateUrl: './repositories-step.component.html'
})
export class RepositoriesComponent implements OnInit {

  @Input() gui: Gui;
  @Input() form: FormGroup;
  constructor() {}

  ngOnInit(): void {
    // console.log("::::RepositoriesComponent ngOnInit gui.inputs[0]" + JSON.stringify(this.gui));
  }

}
