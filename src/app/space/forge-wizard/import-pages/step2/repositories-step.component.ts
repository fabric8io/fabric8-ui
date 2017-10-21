import { Component, Input } from '@angular/core';
import { Gui } from 'ngx-forge';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'repositories-step',
  templateUrl: './repositories-step.component.html'
})
export class RepositoriesComponent {

  @Input() gui: Gui;
  @Input() form: FormGroup;
  constructor() {}
}
