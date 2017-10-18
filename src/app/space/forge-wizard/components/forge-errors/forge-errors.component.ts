import {Component, Input} from '@angular/core';

import { Gui } from '../../gui.model';

@Component({
  selector: 'forge-errors',
  templateUrl: './forge-errors.component.html',
  styleUrls: ['./forge-errors.component.less']
})
export class ForgeErrorsComponent {

  @Input() field: Gui;
  constructor() {}
}
