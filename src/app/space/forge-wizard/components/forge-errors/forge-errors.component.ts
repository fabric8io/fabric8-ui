import {Component, OnInit, Input} from '@angular/core';

import { Gui } from '../../gui.model';

@Component({
  selector: 'forge-errors',
  templateUrl: './forge-errors.component.html',
  styleUrls: ['./forge-errors.component.less']
})
export class ForgeErrorsComponent implements OnInit {

  @Input() field: Gui;
  constructor() {}

  ngOnInit(): void {
    console.log(`::::ForgeErrorsComponenet ngOnInit field= + ${JSON.stringify(this.field)}`);
  }

}
