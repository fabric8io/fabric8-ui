import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Gui } from 'ngx-forge';

@Component({
  selector: 'repositories-step',
  templateUrl: './repositories-step.component.html'
})
export class RepositoriesComponent {

  @Input() gui: Gui;
  @Input() form: FormGroup;
  constructor() {}
}
