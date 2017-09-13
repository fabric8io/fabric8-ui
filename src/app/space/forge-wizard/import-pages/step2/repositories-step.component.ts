import {Component, OnInit, Input} from '@angular/core';

import { Option, SubmittableInput, Input as GuiInput } from '../../gui.model';

@Component({
  selector: 'repositories-step',
  templateUrl: './repositories-step.component.html'
})
export class RepositoriesComponent implements OnInit {

  @Input() gui: GuiInput;
  constructor() {}

  ngOnInit(): void {
    // console.log("::::RepositoriesComponent ngOnInit gui.inputs[0]" + JSON.stringify(this.gui));
  }

}
